# Constitution

Vite + Vue 3 + TypeScript 5 + Tailwind, dark theme config
Always enabled. No `any` types allowed without a suppressed lint rule and a documented reason.
TMDB (themoviedb.org) — richest free API with images, trailers, streaming, trending, and recommendation endpoints.
Dark cinematic — immersive dark backgrounds, hero images, inspired by mockups `bbb.png` and `eee.png`.
Local only — all user data in localStorage (watchlist, ratings, lists, tags, watch history).

- **Routing:** Vue Router
- **Styling:** Tailwind CSS with dark cinematic theme
- **Storage:** localStorage with a typed composable wrapper
- **Build:** Vite

### Data Layer
- `StorageService` — typed localStorage wrapper with JSON serialization, handles migration
- `TMDBService` — API client with circuit breaker, response caching (cache in localStorage to reduce API calls)
- Models: `Movie`, `TVShow`, `LibraryEntry` (user data: rating, watchlist status, lists, tags)

### Key Screens & Components
| Screen | Key Components |
|--------|---------------|
| Home | SearchBar, TrendingCarousel, PopularGrid, MovieCard |
| Library | TabToggle (watchlist/watched/lists), FilterBar, SortDropdown, EntryGrid |
| Details | HeroBackdrop, MetadataPanel, CastCarousel, TrailerEmbed, StreamingBadges, RatingStars |
| Calendar | CalendarGrid, ReleaseCard |
| Stats | StatCards, GenreChart, MonthlyChart, TopRated list |

### localStorage Schema
```json
{
  "library": {
    "[tmdb_id]": {
      "tmdbId": number,
      "mediaType": "movie" | "tv",
      "status": "watchlist" | "watched" | "none",
      "rating": 0-5,
      "favorite": boolean,
      "lists": ["list-id-1"],
      "tags": ["tag1", "tag2"],
      "notes": "",
      "watchDates": ["2026-03-08"],
      "addedAt": "ISO date",
      "cachedData": { /* TMDB response snapshot */ }
    }
  },
  "lists": {
    "[list-id]": { "name": "...", "createdAt": "..." }
  },
  "tags": ["tag1", "tag2"],
  "settings": { "theme": "dark" }
}
```