# Data Model

## Services

- **`StorageService`** — Typed localStorage wrapper with JSON serialization. Handles schema migration between versions. Validates all reads with Zod schemas.
- **`ApiService`** — API client for fetching movie/TV metadata. Implements circuit breaker pattern. All responses are validated through Zod schemas before returning.

## Composables

Composables are the public data-access layer for components. They wrap services with Vue reactivity and expose loading/error state.

- **`useMovie(id)`** — Fetches and exposes reactive movie data via `ApiService`.
- **`useTVShow(id)`** — Fetches and exposes reactive TV show data via `ApiService`.
- **`useLibrary()`** — Reads/writes library entries via `StorageService`. Exposes watchlist, watched, favorites, etc.
- **`useSearch(query)`** — Runs search queries via `ApiService`, exposes reactive results.
- **`useTrending()`** — Fetches trending titles via `ApiService`.

## Models

- **`Movie`** — Movie data (title, year, genres, cast, images, etc.)
- **`TVShow`** — TV show data (title, seasons, episodes, cast, images, etc.)
- **`LibraryEntry`** — User data per title: rating, watchlist status, lists, tags, watch dates

## localStorage Schema

```json
{
  "library": {
    "[id]": {
      "id": "number",
      "mediaType": "movie | tv",
      "status": "watchlist | watched | none",
      "rating": "0-5",
      "favorite": "boolean",
      "lists": ["list-id-1"],
      "tags": ["tag1", "tag2"],
      "notes": "",
      "watchDates": ["2026-03-08"],
      "addedAt": "ISO date"
    }
  },
  "lists": {
    "[list-id]": { "name": "...", "createdAt": "..." }
  },
  "tags": ["tag1", "tag2"],
  "settings": { "theme": "dark" }
}
```