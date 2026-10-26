'use strict';

const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const manifest = require('./manifest');
const { catalogs } = require('./catalogs');
const { itemDisplayName, selectCatalogItems } = require('./catalog-query');
const shows = require('./shows');
const movies = require('./movies');
const PORT = Number.parseInt(process.env.PORT || '7001', 10);
const CATALOG_PAGE_SIZE = 100;
// The data only changes on deploy, so clients can reuse catalog pages for a while.
const CATALOG_CACHE_MAX_AGE_SECONDS = 6 * 60 * 60;
const RPDB_API_KEY = 't0-free-rpdb-blocks';
const RPDB_POSTER_BASE = `https://api.ratingposterdb.com/${RPDB_API_KEY}/imdb/poster-default`;
const builder = new addonBuilder(manifest);

const datasetsByType = new Map([
  ['series', shows],
  ['movie', movies],
]);

const enabledCatalogsByKey = new Map(
  catalogs
    .filter((catalog) => catalog.enabled === true)
    .map((catalog) => [`${catalog.type}:${catalog.id}`, catalog])
);

function parseSkip(extra) {
  const raw = extra && extra.skip;
  const value = Number.parseInt(raw || '0', 10);

  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

function releaseInfo(item) {
  if (item.type === 'series' && !item.endYear) {
    return `${item.startYear}-`;
  }

  if (!item.endYear || item.endYear === item.startYear) {
    return String(item.startYear);
  }

  return `${item.startYear}-${item.endYear}`;
}

function posterUrl(imdbId) {
  return `${RPDB_POSTER_BASE}/${imdbId}.jpg?fallback=true`;
}

function toMetaPreview(item) {
  return {
    id: item.id,
    type: item.type,
    name: itemDisplayName(item),
    poster: posterUrl(item.id),
    posterShape: 'poster',
    releaseInfo: releaseInfo(item),
  };
}

builder.defineCatalogHandler(async ({ type, id, extra }) => {
  const catalog = enabledCatalogsByKey.get(`${type}:${id}`);
  const dataset = datasetsByType.get(type);

  if (!catalog || !dataset) {
    return { metas: [] };
  }

  const orderedItems = selectCatalogItems(dataset, catalog, extra && extra.genre);
  const skip = parseSkip(extra);
  const page = orderedItems.slice(skip, skip + CATALOG_PAGE_SIZE);

  return {
    metas: page.map(toMetaPreview),
    cacheMaxAge: CATALOG_CACHE_MAX_AGE_SECONDS,
  };
});

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

console.log(
  `Nostalgia Rewind v${manifest.version}: ` +
    `${manifest.catalogs.length} catalogs, ${shows.length} shows, ` +
    `${movies.length} movies on port ${PORT}`
);

serveHTTP(builder.getInterface(), {
  port: PORT,
  cacheMaxAge: 0,
  static: '/public',
});
