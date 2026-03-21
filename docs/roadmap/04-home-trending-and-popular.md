# Home Screen: Trending and Popular Sections

- Trending section via `GET /trending/movie/week` and `GET /trending/tv/week`
- Popular section via `GET /movie/popular` and `GET /tv/popular`
- Tapping a card navigates to the entry's detail page
- **Key components:** TrendingCarousel, PopularGrid, MovieCard

## Acceptance Criteria

- [ ] `TrendingCarousel` displays a horizontally scrollable row of `MovieCard` items
- [ ] `PopularGrid` displays popular entries in a responsive grid layout
- [ ] Both sections fetch data on mount and show loading skeletons while pending
- [ ] Each section handles API errors with an inline retry prompt
- [ ] Sections appear below the `SearchBar` on the home screen

## Key Decisions

- **Weekly time window for trending** — `"week"` gives more stable results than `"day"` for a personal tracker
- **Movies and TV combined** — both trending endpoints are called and results are interleaved by popularity score
