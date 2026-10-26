'use strict';

// Decides which items a catalog shows and in what order. Shared by the addon
// and the validator so both always agree on catalog contents.

const alphabeticalCollator = new Intl.Collator('en-US', {
  sensitivity: 'base',
  numeric: true,
});

function itemDisplayName(item) {
  return item.displayName || item.name;
}

function alphabeticalSortKey(item) {
  return itemDisplayName(item)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/^[^\p{L}\p{N}]+/gu, '')
    .trim();
}

function alphabeticalGroup(item) {
  const key = alphabeticalSortKey(item);

  if (/^[0-9]/.test(key)) {
    return 0;
  }

  if (/^[A-Za-z]/.test(key)) {
    return 1;
  }

  return 2;
}

function compareNames(a, b) {
  return (
    alphabeticalGroup(a) - alphabeticalGroup(b) ||
    alphabeticalCollator.compare(alphabeticalSortKey(a), alphabeticalSortKey(b)) ||
    alphabeticalCollator.compare(itemDisplayName(a), itemDisplayName(b))
  );
}

// Best-known titles first, so each home-screen row opens with its strongest picks.
function compareFeatured(a, b) {
  return (
    b.featuredRank - a.featuredRank ||
    a.startYear - b.startYear ||
    compareNames(a, b)
  );
}

function hasAnyTag(item, tags) {
  return tags.some((tag) => item.tags.includes(tag));
}

// The year that places a title in exactly one decade filter. Series often debut
// late in a year (The Simpsons, December 1989), so they count from their first
// full year on air; movies count from release.
function heydayYear(item) {
  if (item.type !== 'series') {
    return item.startYear;
  }

  return Math.min(item.startYear + 1, item.endYear || Infinity);
}

function matchesFilter(item, filter) {
  if (filter.years) {
    const [fromYear, toYear] = filter.years;
    const year = heydayYear(item);
    return year >= fromYear && year <= toYear;
  }

  return hasAnyTag(item, filter.tags);
}

function matchesCatalog(item, catalog) {
  return (
    item.enabled === true &&
    item.type === catalog.type &&
    (!catalog.tags || hasAnyTag(item, catalog.tags))
  );
}

function findFilter(catalog, filterName) {
  return (catalog.filters || []).find((filter) => filter.name === filterName);
}

// Returns the catalog's items in display order, narrowed to the named filter
// when one is given. An unknown filter name matches nothing.
function selectCatalogItems(dataset, catalog, filterName) {
  const items = dataset.filter((item) => matchesCatalog(item, catalog));

  if (!filterName) {
    return items.sort(compareFeatured);
  }

  const filter = findFilter(catalog, filterName);
  if (!filter) {
    return [];
  }

  return items.filter((item) => matchesFilter(item, filter)).sort(compareFeatured);
}

module.exports = {
  itemDisplayName,
  selectCatalogItems,
};
