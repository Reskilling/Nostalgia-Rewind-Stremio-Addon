'use strict';

const path = require('path');
const shows = require(path.join(__dirname, '..', 'shows'));
const movies = require(path.join(__dirname, '..', 'movies'));
const { catalogs, KNOWN_TAGS, LEGACY_CATALOGS, MEDIA_TYPES } = require(path.join(__dirname, '..', 'catalogs'));
const { selectCatalogItems } = require(path.join(__dirname, '..', 'catalog-query'));
const manifest = require(path.join(__dirname, '..', 'manifest'));

const errors = [];
const knownTags = new Set(KNOWN_TAGS);

function normalizeTitle(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function validateDataset(items, expectedType, label) {
  if (!Array.isArray(items)) {
    errors.push(`${label} must export an array.`);
    return;
  }

  const ids = new Set();
  const titles = new Map();

  for (const [index, item] of items.entries()) {
    const where = `${label}[${index}]`;

    if (!item || typeof item !== 'object') {
      errors.push(`${where} is not a valid record.`);
      continue;
    }

    if (!/^tt\d+$/.test(item.id || '')) {
      errors.push(`${where} has invalid IMDb ID: ${item.id}`);
    } else if (ids.has(item.id)) {
      errors.push(`${label} has duplicate IMDb ID: ${item.id}`);
    } else {
      ids.add(item.id);
    }

    if (item.type !== expectedType) {
      errors.push(`${where} has type ${item.type}; expected ${expectedType}.`);
    }

    if (typeof item.name !== 'string' || !item.name.trim()) {
      errors.push(`${where} has no valid name.`);
    }

    if (!Number.isInteger(item.startYear)) {
      errors.push(`${where} has invalid startYear.`);
    }

    if (!Number.isInteger(item.featuredRank)) {
      errors.push(`${where} has invalid featuredRank.`);
    }

    if (!Array.isArray(item.tags)) {
      errors.push(`${where} has no tags array.`);
    } else {
      const seenTags = new Set();
      for (const tag of item.tags) {
        if (seenTags.has(tag)) {
          errors.push(`${where} repeats tag: ${tag}`);
        }
        seenTags.add(tag);

        if (!knownTags.has(tag)) {
          errors.push(`${where} uses unknown tag: ${tag}`);
        }
      }
    }

    const names = [item.name, ...(Array.isArray(item.alternateTitles) ? item.alternateTitles : [])];
    for (const title of names) {
      const normalized = normalizeTitle(title);
      if (!normalized) continue;

      const previous = titles.get(normalized);
      if (previous && previous !== item.id) {
        errors.push(`${label} title/alias collision: "${title}" (${previous}, ${item.id}).`);
      } else {
        titles.set(normalized, item.id);
      }
    }
  }
}

function validateTags(owner, tags) {
  for (const tag of tags || []) {
    if (!knownTags.has(tag)) {
      errors.push(`${owner} references unknown tag: ${tag}`);
    }
  }
}

function validateCatalog(catalog) {
  if (!MEDIA_TYPES.includes(catalog.type)) {
    errors.push(`${catalog.id} has invalid media type: ${catalog.type}`);
    return;
  }

  validateTags(catalog.id, catalog.tags);

  const filterNames = new Set();
  for (const filter of catalog.filters || []) {
    if (filterNames.has(filter.name)) {
      errors.push(`${catalog.id} repeats filter: ${filter.name}`);
    }
    filterNames.add(filter.name);

    const owner = `${catalog.id} filter "${filter.name}"`;
    if (Array.isArray(filter.tags) === Array.isArray(filter.years)) {
      errors.push(`${owner} must define exactly one of tags or years.`);
    } else if (filter.years && !(filter.years.length === 2 && filter.years[0] <= filter.years[1])) {
      errors.push(`${owner} has an invalid years range.`);
    }
    validateTags(owner, filter.tags);
  }

  if (catalog.enabled !== true) {
    return;
  }

  if (selectCatalogItems(catalog).length === 0) {
    errors.push(`${catalog.id} is enabled but matches zero records.`);
  }
  for (const filter of catalog.filters || []) {
    if (selectCatalogItems(catalog, filter.name).length === 0) {
      errors.push(`${catalog.id} filter "${filter.name}" matches zero records.`);
    }
  }
}

function validateLegacyCatalog(legacyKey, target) {
  const type = legacyKey.split(':')[0];
  const catalog = catalogs.find((item) => item.type === type && item.id === target.id);

  if (!catalog || catalog.enabled !== true) {
    errors.push(`Legacy catalog ${legacyKey} points to missing or disabled catalog: ${target.id}`);
  } else if (!(catalog.filters || []).some((filter) => filter.name === target.filter)) {
    errors.push(`Legacy catalog ${legacyKey} points to missing filter: ${target.filter}`);
  }
}

function catalogSummary(catalog) {
  const lines = [`${catalog.name}: ${selectCatalogItems(catalog).length}`];

  for (const filter of catalog.filters || []) {
    lines.push(`  ${filter.name}: ${selectCatalogItems(catalog, filter.name).length}`);
  }

  return lines;
}

validateDataset(shows, 'series', 'shows');
validateDataset(movies, 'movie', 'movies');

const catalogKeys = new Set();
for (const catalog of catalogs) {
  const key = `${catalog.type}:${catalog.id}`;

  if (catalogKeys.has(key)) {
    errors.push(`Duplicate catalog key: ${key}`);
  }
  catalogKeys.add(key);

  validateCatalog(catalog);
}

for (const [legacyKey, target] of Object.entries(LEGACY_CATALOGS)) {
  validateLegacyCatalog(legacyKey, target);
}

if (manifest.id !== 'community.nostalgiarewind.catalogs') {
  errors.push(`Unexpected manifest ID: ${manifest.id}`);
}
if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
  errors.push(`Manifest version is not semver: ${manifest.version}`);
}

if (errors.length > 0) {
  console.error(`Validation failed with ${errors.length} error(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Validation passed: ${shows.length} shows, ${movies.length} movies, ${catalogs.length} catalogs.`);
for (const catalog of catalogs.filter((item) => item.enabled === true)) {
  console.log(catalogSummary(catalog).join('\n'));
}
