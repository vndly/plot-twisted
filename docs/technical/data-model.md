# Data Model

## Models

All types will be defined as Zod schemas in `src/types/` with TypeScript types inferred via `z.infer<>`.

### MovieListItem

Returned by list endpoints: search, trending, popular.

```ts
interface MovieListItem {
  id: number
  title: string
  original_title: string
  overview: string
  release_date: string              // "YYYY-MM-DD"
  poster_path: string | null        // relative path, e.g. "/kqjL17y...jpg"
  backdrop_path: string | null
  vote_average: number              // 0–10
  vote_count: number
  popularity: number
  genre_ids: number[]               // e.g. [28, 12, 878]
  adult: boolean
  original_language: string         // ISO 639-1, e.g. "en"
  video: boolean
}
```

### MovieDetail

Returned by `/movie/{id}` with `append_to_response=credits,videos,watch/providers,release_dates`.

```ts
interface MovieDetail {
  id: number
  title: string
  original_title: string
  overview: string
  tagline: string
  release_date: string              // "YYYY-MM-DD"
  runtime: number | null            // minutes
  status: string                    // "Released", "Post Production", etc.
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number              // 0–10
  vote_count: number
  popularity: number
  adult: boolean
  original_language: string
  budget: number                    // USD (0 if unknown)
  revenue: number                   // USD (0 if unknown)
  homepage: string | null
  imdb_id: string | null            // e.g. "tt1234567"
  genres: Genre[]
  spoken_languages: SpokenLanguage[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  belongs_to_collection: Collection | null

  // Appended relations
  credits: {
    cast: CastMember[]
    crew: CrewMember[]
  }
  videos: {
    results: Video[]
  }
  "watch/providers": {
    results: Record<string, WatchProviderRegion>  // keyed by region code, e.g. "US"
  }
  release_dates: {
    results: ReleaseDateRegion[]
  }
}
```

### TVShowListItem

Returned by list endpoints: search, trending, popular.

```ts
interface TVShowListItem {
  id: number
  name: string
  original_name: string
  overview: string
  first_air_date: string            // "YYYY-MM-DD"
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number              // 0–10
  vote_count: number
  popularity: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  origin_country: string[]          // ISO 3166-1, e.g. ["US"]
}
```

### TVShowDetail

Returned by `/tv/{id}` with `append_to_response=credits,videos,watch/providers,content_ratings`.

```ts
interface TVShowDetail {
  id: number
  name: string
  original_name: string
  overview: string
  tagline: string
  first_air_date: string
  last_air_date: string | null
  status: string                    // "Returning Series", "Ended", "Canceled"
  number_of_seasons: number
  number_of_episodes: number
  episode_run_time: number[]        // typical episode length(s) in minutes
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  original_language: string
  homepage: string | null
  genres: Genre[]
  spoken_languages: SpokenLanguage[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  origin_country: string[]
  created_by: Creator[]
  networks: Network[]
  next_episode_to_air: Episode | null

  // Appended relations
  credits: {
    cast: CastMember[]
    crew: CrewMember[]
  }
  videos: {
    results: Video[]
  }
  "watch/providers": {
    results: Record<string, WatchProviderRegion>
  }
  content_ratings: {
    results: ContentRating[]
  }
}
```

### Shared Sub-types

```ts
interface Genre {
  id: number
  name: string                      // e.g. "Action", "Comedy"
}

interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null       // headshot image
  order: number                     // billing order
}

interface CrewMember {
  id: number
  name: string
  job: string                       // e.g. "Director", "Screenplay"
  department: string                // e.g. "Directing", "Writing"
  profile_path: string | null
}

interface Video {
  id: string
  key: string                       // YouTube video ID
  name: string
  site: string                      // "YouTube"
  type: string                      // "Trailer", "Teaser", "Featurette"
  official: boolean
}

interface WatchProviderRegion {
  link: string
  flatrate?: StreamingProvider[]    // subscription services
  rent?: StreamingProvider[]
  buy?: StreamingProvider[]
}

interface StreamingProvider {
  provider_id: number
  provider_name: string             // e.g. "Netflix", "Apple TV+"
  logo_path: string
  display_priority: number
}

interface ReleaseDateRegion {
  iso_3166_1: string                // e.g. "US"
  release_dates: {
    certification: string           // e.g. "PG-13", "R"
    release_date: string
    type: number                    // 1=Premiere, 2=Limited, 3=Theatrical, etc.
  }[]
}

interface ContentRating {
  iso_3166_1: string                // e.g. "US"
  rating: string                    // e.g. "TV-MA", "TV-14"
}

interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

interface ProductionCountry {
  iso_3166_1: string
  name: string
}

interface Collection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

interface Creator {
  id: number
  name: string
  profile_path: string | null
}

interface Network {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

interface Episode {
  id: number
  name: string
  overview: string
  air_date: string
  season_number: number
  episode_number: number
  runtime: number | null
}

interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}
```

### LibraryEntry

User data for a saved movie or TV show. Stored in localStorage, validated with Zod on every read.

```ts
interface LibraryEntry {
  id: number                        // TMDB ID
  mediaType: "movie" | "tv"
  status: "watchlist" | "watched" | "none"
  rating: number                    // 0 (unrated) to 5
  favorite: boolean
  lists: string[]                   // IDs of custom lists this entry belongs to
  tags: string[]                    // user-defined tags, e.g. ["horror", "90s"]
  notes: string                     // free-text user notes
  watchDates: string[]              // ISO dates, e.g. ["2026-03-08"] (supports rewatches)
  addedAt: string                   // ISO date — when the entry was first saved
}
```

### CustomList

User-created list for grouping library entries.

```ts
interface CustomList {
  id: string                        // generated UUID
  name: string                      // user-provided name, trimmed + sanitized
  createdAt: string                 // ISO date
}
```

### Settings

User preferences. Persisted in localStorage.

```ts
interface Settings {
  theme: "dark" | "light"
  language: string                  // ISO 639-1, e.g. "en"
  defaultHomeSection: "trending" | "popular" | "search"
  preferredRegion: string           // ISO 3166-1, e.g. "US" — for streaming availability
}
```

## localStorage Schema

All user data is persisted in localStorage as JSON, keyed under a single top-level namespace. `StorageService` owns all reads and writes — raw `localStorage` access outside the service is prohibited.

```json
{
  "schemaVersion": 1,
  "library": {
    "[tmdb-id]": "LibraryEntry"
  },
  "lists": {
    "[list-uuid]": "CustomList"
  },
  "tags": ["tag1", "tag2"],
  "settings": "Settings"
}
```

- **`schemaVersion`** — integer incremented on breaking changes. `StorageService` checks this on startup and runs migration functions to transform old data shapes.
- **`library`** — dictionary of `LibraryEntry` objects keyed by TMDB ID. Only entries the user has explicitly saved appear here.
- **`lists`** — dictionary of `CustomList` objects keyed by UUID. Membership is tracked on the entry side (`LibraryEntry.lists`).
- **`tags`** — global tag list. Kept in sync with tags referenced by library entries.
- **`settings`** — single `Settings` object. Defaults are applied if missing keys are detected during Zod validation.

## Services

- **`StorageService`** — Typed localStorage wrapper with JSON serialization. Handles schema migration between versions. Validates all reads with Zod schemas.
- **`ApiService`** — API client for fetching movie/TV metadata. Implements circuit breaker pattern. All responses are validated through Zod schemas before returning.

## Composables

Composables are the public data-access layer for components. They wrap services with Vue reactivity and expose a standard return shape:

```ts
{
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refresh?: () => Promise<void>
}
```

- **`useMovie(id)`** — Fetches and exposes reactive movie data via `ApiService`.
- **`useTVShow(id)`** — Fetches and exposes reactive TV show data via `ApiService`.
- **`useLibrary()`** — Reads/writes library entries via `StorageService`. Exposes watchlist, watched, favorites, etc.
- **`useSearch(query)`** — Runs search queries via `ApiService`, exposes reactive results.
- **`useTrending()`** — Fetches trending titles via `ApiService`.
