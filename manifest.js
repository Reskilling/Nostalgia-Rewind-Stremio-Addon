'use strict';

const { catalogs } = require('./catalogs');

function catalogExtras(catalog) {
  const extras = [{ name: 'skip', isRequired: false }];

  if (catalog.filters) {
    extras.push({
      name: 'genre',
      isRequired: false,
      options: catalog.filters.map((filter) => filter.name),
    });
  }

  return extras;
}

const enabledCatalogs = catalogs
  .filter((catalog) => catalog.enabled === true)
  .map((catalog) => ({
    type: catalog.type,
    id: catalog.id,
    name: catalog.name,
    extra: catalogExtras(catalog),
  }));

module.exports = {
  id: 'community.nostalgiarewind.catalogs',
  version: '1.2.0',
  name: 'Nostalgia Rewind',
  description:
    'A definitive nostalgia channel: the cartoons, kids TV, sitcoms and movies a generation grew up with, best-loved first.',
  logo: 'https://2f680d7c8e22-nostalgia-rewind.baby-beamup.club/public/Nostalgia-Rewind.png',
  resources: [
    {
      name: 'catalog',
      types: ['series', 'movie'],
    },
  ],
  types: ['series', 'movie'],
  catalogs: enabledCatalogs,
  behaviorHints: {
    configurable: false,
    configurationRequired: false,
  },
};
