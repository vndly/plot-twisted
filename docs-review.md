# Docs Review

## Missing Documentation

### 1. Genre list endpoints

The filter bar needs genre data (`/genre/movie/list`, `/genre/tv/list`), but these aren't documented in `api.md`. Without them, home and library filters can't show genre names.

### 2. i18n strategy

Settings include "Language" and the API supports a `language` parameter, but there's no doc on how the app handles language switching (UI strings, TMDB locale, etc.).

### 3. Image handling strategy

No guidance on responsive image sizes (when to use `w185` vs `w342` vs `w500`), lazy loading images, or fallback placeholders for missing posters/backdrops.

### 4. Caching / performance

No mention of route lazy loading, API response caching, or deduplication of concurrent requests to the same endpoint.

### 5. URL / deep linking behavior

What happens when a user navigates directly to `/movie/550`? Is there offline handling? How are invalid IDs handled?
