# Nostalgia Rewind

Nostalgia Rewind is a Stremio catalog addon for the cartoons, kids TV, sitcoms,
and movies a generation grew up with. This README is for whoever maintains the
addon: it explains how the catalogs work, how to edit the title list, and how
to deploy a new version. Anime is out of scope; a separate addon covers it.

## Install the addon

In Stremio, paste the following URL into the addon search box:

```
https://2f680d7c8e22-nostalgia-rewind.baby-beamup.club/manifest.json
```

Use the full `https://` URL ending in `/manifest.json`. The bare domain returns
a web page, and Stremio reports that the addon failed to fetch.

## How the catalogs work

The addon adds five rows to the Stremio home screen:

- **Nostalgia Rewind TV**
- **Nickelodeon Rewind**
- **Cartoon Network Rewind**
- **Disney Rewind**
- **Nostalgia Rewind Movies**

The TV and Movies rows also have filters, which Stremio shows as a dropdown in
**Discover**. Filters come in two kinds:

Decade filters
: **80s & Earlier**, **90s**, and **2000s**. Each title belongs to exactly one
  decade: a movie by its release year, a series by its first full year on air
  (a show that premiered in late 1989 counts as 90s).

Category filters
: Channels and genres such as **Fox Kids & Kids' WB** or **Spooky**. A title
  matches when it carries any of the filter's tags.

Every row and filter lists titles best-known first, by each title's
`featuredRank`, then by year, then alphabetically.

All of this is configured in [`catalogs.js`](catalogs.js), and
[`catalog-query.js`](catalog-query.js) decides which titles each request
returns.

## Run the addon locally

1. Install dependencies:

   ```
   npm install
   ```

1. Start the server:

   ```
   npm start
   ```

   The server listens on port 7001 unless the `PORT` environment variable says
   otherwise.

1. Confirm that the manifest loads at `http://127.0.0.1:7001/manifest.json`.
   To try the local addon in Stremio, install it from that URL.

## Edit the title list

Shows live in [`shows.json`](shows.json) and movies in
[`movies.json`](movies.json). Both are lists of records like this one:

```json
{
  "id": "tt0101084",
  "name": "Doug",
  "startYear": 1991,
  "endYear": 1996,
  "type": "series",
  "tags": ["nickelodeon", "nicktoons", "kids-animation", "comedy"],
  "enabled": true,
  "featuredRank": 90
}
```

The following fields are required:

| Field | Meaning |
|---|---|
| `id` | The IMDb ID, from the title's IMDb URL (`imdb.com/title/tt0101084/`). Stremio uses it to find posters and streams. |
| `name` | The title as IMDb lists it. |
| `startYear` | The year the title premiered or was released. |
| `endYear` | For a series, the last year of its original run, or `null` if it's still running. For a movie, `null`. |
| `type` | `series` in `shows.json`, `movie` in `movies.json`. |
| `tags` | Facts about the title. Use only tags listed in `KNOWN_TAGS` in [`catalogs.js`](catalogs.js). |
| `enabled` | `true` to show the title; `false` to hide it without deleting it. |
| `featuredRank` | How well-known the title is; see [Choose a rank](#choose-a-rank). |

Records can also have `displayName` (a friendlier name to show in Stremio),
`alternateTitles`, `franchise`, and `notes`. Keep each file in alphabetical
order so diffs stay readable.

### Choose a rank

`featuredRank` decides where a title appears in its rows, so pick it
deliberately rather than leaving a default:

| Rank | Use for | Examples |
|---|---|---|
| 95–100 | Household names that open the rows | Rugrats, Home Alone, Saved by the Bell |
| 85–92 | Widely remembered | Goof Troop, Air Bud, Wishbone |
| 75–82 | Cult favourites and solid picks | Earthworm Jim, The Rocketeer |
| 60–72 | Deep cuts, mostly for **Hidden Gems** | Histeria!, 2 Stupid Dogs |

### Add a filter or row

To add a filter, add an entry to `SERIES_FILTERS` or `MOVIE_FILTERS` in
[`catalogs.js`](catalogs.js). To add a home-screen row, add an entry to
`catalogs`. Each new row adds to the home screen for every user, so prefer a
filter unless the category deserves a row of its own.

### Validate your changes

Before you commit, run the validator:

```
npm run validate
```

It checks for duplicate or malformed IMDb IDs, unknown tags, clashing titles,
and filters or rows that match nothing, then prints how many titles each row
and filter contains.

## Deploy a new version

The addon is hosted on BeamUp. The `beamup` command deploys your latest
**commit**, not uncommitted files.

### Before you begin

- Install the BeamUp CLI: `npm install -g beamup-cli`.
- Add your SSH key to your GitHub account (GitHub username `Reskilling`).
- In a fresh clone of this repository, add the BeamUp git remote:

  ```
  git remote add beamup dokku@a.baby-beamup.club:2f680d7c8e22/nostalgia-rewind
  ```

  The CLI only adds this remote when it creates `beamup.json`, and that file is
  already committed, so a new clone never gets the remote automatically. If
  the deploy fails with a permission or public key error, run `beamup config`
  and enter host `a.baby-beamup.club` and GitHub username `Reskilling`.

### Deploy

1. Run `npm run validate` and confirm that it passes.
1. If you changed what users see, increase `version` in
   [`manifest.js`](manifest.js).
1. Commit your changes and push them to GitHub:

   ```
   git add -A
   git commit -m "DESCRIPTION"
   git push origin main
   ```

   Replace `DESCRIPTION` with a summary of the change.

1. Run `beamup`.
   - If it asks whether to create a new commit because the commit history
     didn't change, enter `n`. This happens when a previous deploy failed
     after recording the commit as deployed.
   - When it asks for the passphrase for your SSH key, enter it. Nothing
     appears as you type.
1. Commit the updated `beamup.json`, which records the deployed commit:

   ```
   git commit -am "Record BeamUp deploy"
   git push origin main
   ```

### Verify the deploy

Title lists update as soon as the deploy finishes. The manifest, which holds
row names and filter options, is cached for up to 4 hours. After that:

1. Open the manifest URL and confirm that `version` matches
   [`manifest.js`](manifest.js).
1. In Stremio, uninstall the addon and install it again from the manifest URL.

To see build output from the server, run `beamup logs`.

## Retired catalogs

Installs from before v1.1.0 still request the old category rows. The
`LEGACY_CATALOGS` map in [`catalogs.js`](catalogs.js) serves each one the
closest current filter so those rows don't go blank. Delete the map once old
installs are no longer a concern.
