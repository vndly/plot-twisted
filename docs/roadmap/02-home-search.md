# Home Screen: Search

* Search for movies and TV shows via `GET /search/multi`
* Display results as `MovieCard` items in a responsive grid
* Tapping a card navigates to `/movie/:id` or `/tv/:id`
* **Key components:** SearchBar, MovieCard

## Acceptance Criteria

- [ ] `SearchBar` debounces input (300 ms) before firing an API request
- [ ] Results are filtered to `media_type === "movie" | "tv"` (discard `"person"`)
- [ ] Each `MovieCard` shows poster, title, year, and vote average
- [ ] Empty state shown when query returns zero results
- [ ] Loading skeleton displayed while the API request is in flight
- [ ] API errors surface a user-friendly inline message (not a full-page error)

## Key Decisions

* **`/search/multi` over separate endpoints** — single request covers both movies and TV shows, reducing API calls
* **Client-side person filtering** — simpler than calling two separate endpoints and merging results
