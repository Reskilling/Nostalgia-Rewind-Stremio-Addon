'use strict';

// Nostalgia Rewind catalog configuration.
//
// Every catalog is a row on the Stremio home screen, so keep the list short.
// Categories that don't need their own row belong in a type's filters, which
// Stremio shows as a dropdown in Discover. Catalogs and filters both match an
// item when it carries any of their tags; a catalog with no tags matches all.
// Decade filters match by years instead: each title belongs to the one decade
// of its heyday (see catalog-query.js), so a show running 1987-1995 is 90s.
// Toggle a catalog by changing only its enabled value.

const MEDIA_TYPES = ['series', 'movie'];

const KNOWN_TAGS = [
  'action',
  'adult-animation',
  'adult-swim',
  'after-school',
  'animated-movies',
  'cartoon-network',
  'cartoon-network-movies',
  'comedy',
  'comedy-movies',
  'cult-animation',
  'dc',
  'disney-afternoon',
  'disney-channel',
  'disney-channel-movies',
  'disney-movies',
  'educational',
  'family-movies',
  'fantasy-adventure-movies',
  'forgotten-obscure',
  'fox-kids',
  'kids-animation',
  'kids-teen-sitcoms',
  'kids-wb',
  'live-action-kids',
  'live-action-primetime',
  'marvel',
  'nickelodeon',
  'nickelodeon-movies',
  'nicktoons',
  'one-saturday-morning',
  'pbs',
  'pbs-kids',
  'playhouse-disney',
  'preschool',
  'retro-syndication',
  'saturday-morning',
  'science-nature',
  'snick',
  'spooky-movies',
  'superhero-animation',
  'superhero-movies',
  'syndicated-classics',
  'teen-movies',
  'toon-disney',
  'weird-cartoons',
];

const NICKELODEON_TAGS = ['nickelodeon', 'nicktoons', 'snick'];
const CARTOON_NETWORK_TAGS = ['cartoon-network'];
const DISNEY_TV_TAGS = [
  'disney-channel',
  'toon-disney',
  'disney-afternoon',
  'one-saturday-morning',
  'playhouse-disney',
];

const DECADE_FILTERS = [
  { name: '80s & Earlier', years: [0, 1989] },
  { name: '90s', years: [1990, 1999] },
  { name: '2000s', years: [2000, 2009] },
];

const SERIES_FILTERS = [
  ...DECADE_FILTERS,
  { name: 'Nickelodeon', tags: NICKELODEON_TAGS },
  { name: 'Cartoon Network', tags: CARTOON_NETWORK_TAGS },
  { name: 'Disney', tags: DISNEY_TV_TAGS },
  { name: "Fox Kids & Kids' WB", tags: ['fox-kids', 'kids-wb'] },
  { name: 'Superheroes', tags: ['superhero-animation'] },
  { name: 'PBS & Preschool', tags: ['pbs', 'pbs-kids', 'preschool', 'educational', 'science-nature'] },
  { name: 'Live Action & Sitcoms', tags: ['live-action-kids', 'kids-teen-sitcoms', 'live-action-primetime'] },
  { name: 'Adult Swim & Adult Animation', tags: ['adult-animation', 'adult-swim'] },
  { name: 'Hidden Gems', tags: ['forgotten-obscure'] },
];

const MOVIE_FILTERS = [
  ...DECADE_FILTERS,
  { name: 'Animated', tags: ['animated-movies'] },
  { name: 'Disney', tags: ['disney-movies'] },
  { name: 'TV Movies & DCOMs', tags: ['disney-channel-movies', 'nickelodeon-movies', 'cartoon-network-movies'] },
  { name: 'Superheroes', tags: ['superhero-movies'] },
  { name: 'Teen', tags: ['teen-movies'] },
  { name: 'Spooky', tags: ['spooky-movies'] },
];

const catalogs = [
  {
    id: 'nostalgia-rewind-tv',
    name: 'Nostalgia Rewind TV',
    type: 'series',
    filters: SERIES_FILTERS,
    enabled: true,
  },
  {
    id: 'nostalgia-rewind-nickelodeon',
    name: 'Nickelodeon Rewind',
    type: 'series',
    tags: NICKELODEON_TAGS,
    enabled: true,
  },
  {
    id: 'nostalgia-rewind-cartoon-network',
    name: 'Cartoon Network Rewind',
    type: 'series',
    tags: CARTOON_NETWORK_TAGS,
    enabled: true,
  },
  {
    id: 'nostalgia-rewind-disney-tv',
    name: 'Disney Rewind',
    type: 'series',
    tags: DISNEY_TV_TAGS,
    enabled: true,
  },
  {
    id: 'nostalgia-rewind-movies',
    name: 'Nostalgia Rewind Movies',
    type: 'movie',
    filters: MOVIE_FILTERS,
    enabled: true,
  },
];

// Catalog IDs from v1.0.x. Installs made before v1.1.0 keep requesting them
// until the addon is reinstalled, so each one serves the closest current
// catalog and filter instead of an empty row. The old Anime row has no
// equivalent and stays empty. Delete this map once old installs are gone.
const LEGACY_CATALOGS = {
  'series:nostalgia-rewind-saturday-after-school': { id: 'nostalgia-rewind-tv', filter: "Fox Kids & Kids' WB" },
  'series:nostalgia-rewind-pbs-preschool': { id: 'nostalgia-rewind-tv', filter: 'PBS & Preschool' },
  'series:nostalgia-rewind-live-action-sitcoms': { id: 'nostalgia-rewind-tv', filter: 'Live Action & Sitcoms' },
  'series:nostalgia-rewind-adult-animation': { id: 'nostalgia-rewind-tv', filter: 'Adult Swim & Adult Animation' },
  'series:nostalgia-rewind-forgotten-obscure': { id: 'nostalgia-rewind-tv', filter: 'Hidden Gems' },
  'movie:nostalgia-rewind-kids-family-movies': { id: 'nostalgia-rewind-movies', filter: 'Animated' },
  'movie:nostalgia-rewind-tv-movies-specials': { id: 'nostalgia-rewind-movies', filter: 'TV Movies & DCOMs' },
  'movie:nostalgia-rewind-anime-superhero-movies': { id: 'nostalgia-rewind-movies', filter: 'Superheroes' },
  'movie:nostalgia-rewind-teen-comedy-adventure': { id: 'nostalgia-rewind-movies', filter: 'Teen' },
};

module.exports = {
  catalogs,
  KNOWN_TAGS,
  LEGACY_CATALOGS,
  MEDIA_TYPES,
};
