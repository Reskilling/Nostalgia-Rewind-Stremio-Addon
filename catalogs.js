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
  'action-anime',
  'adult-animation',
  'adult-swim',
  'after-school',
  'animated-movies',
  'anime',
  'anime-movies',
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
  'fantasy-anime',
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
  'toonami',
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
  { name: 'Toonami', tags: ['toonami'] },
  { name: 'Anime', tags: ['anime'] },
  { name: 'Superheroes', tags: ['superhero-animation'] },
  { name: 'Retro Reruns', tags: ['retro-syndication', 'syndicated-classics'] },
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
  { name: 'Anime', tags: ['anime-movies'] },
  { name: 'Superheroes', tags: ['superhero-movies'] },
  { name: 'Teen', tags: ['teen-movies'] },
  { name: 'Comedy', tags: ['comedy-movies'] },
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
    name: 'Nickelodeon',
    type: 'series',
    tags: NICKELODEON_TAGS,
    enabled: true,
  },
  {
    id: 'nostalgia-rewind-cartoon-network',
    name: 'Cartoon Network',
    type: 'series',
    tags: CARTOON_NETWORK_TAGS,
    enabled: true,
  },
  {
    id: 'nostalgia-rewind-disney-tv',
    name: 'Disney TV',
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

module.exports = {
  catalogs,
  KNOWN_TAGS,
  MEDIA_TYPES,
};
