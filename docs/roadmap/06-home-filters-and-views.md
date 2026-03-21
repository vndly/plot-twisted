# Home Screen: Filters and Grid/List View

* Filter home screen results by genre, media type (movie/TV), and year range
* Toggle between grid view (poster cards) and list view (compact rows)
* Filters apply client-side to already-fetched trending/popular data
* **Key components:** FilterBar, MovieCard

## Acceptance Criteria

- [ ] `FilterBar` exposes genre multi-select, media type toggle, and year range inputs
- [ ] Genre list is fetched from the media provider's genre endpoints and cached for the session
- [ ] Filters compose (AND logic) — e.g., genre "Action" + type "Movie" shows only action movies
- [ ] `ViewToggle` switches between grid and list layout; preference persists in localStorage
- [ ] Clearing all filters restores the unfiltered view
- [ ] Filter state is reflected in the URL query string for shareability

## Key Decisions

* **Client-side filtering** — trending/popular data sets are small enough (20 items per page) to filter in-memory without re-fetching
* **Genre IDs from the media provider** — genre names are resolved via `/genre/movie/list` and `/genre/tv/list`, not hardcoded
