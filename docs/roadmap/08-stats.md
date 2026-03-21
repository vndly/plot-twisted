# Stats

- Overview charts and lists computed from the user's localStorage library
- **Key components:** StatCards, GenreChart, MonthlyChart, TopRatedList

## Acceptance Criteria

- [ ] `StatCards` show: total watched, total watchlist, average rating, total watch time (summed runtime)
- [ ] `GenreChart` displays a bar or pie chart of watched entries by genre
- [ ] `MonthlyChart` shows entries watched per month for the current year
- [ ] `TopRatedList` lists the user's top 10 highest-rated entries
- [ ] All stats update reactively when library data changes
- [ ] Empty state displayed when the library has no watched entries

## Key Decisions

- **Client-side computation only** — all stats are derived from localStorage; no API calls needed
- **Chart library TBD** — lightweight option (e.g., Chart.js or a headless charting lib) chosen at implementation time to minimize bundle size
