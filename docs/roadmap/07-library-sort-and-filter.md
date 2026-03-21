# Library: Sort and Filter

* Sort library entries by date added, title, year, or user rating
* Filter by genre, media type, watch status, rating range, and custom list
* All operations run client-side against localStorage data
* **Key components:** FilterBar, SortDropdown, EntryGrid

## Acceptance Criteria

- [ ] `SortDropdown` offers: Date Added (newest/oldest), Title (A–Z / Z–A), Release Year, User Rating (high/low)
- [ ] Default sort is Date Added (newest first)
- [ ] `FilterBar` exposes genre multi-select, media type toggle, rating range slider, and list selector
- [ ] Filters compose with AND logic, same as the home screen filter bar
- [ ] Active filter count is shown as a badge on the filter bar
- [ ] Empty state shown when filters exclude all entries ("No items match your filters")

## Key Decisions

* **Reuse `FilterBar` component from phase 06** — same component with additional filter options (rating, list) enabled via props
* **No pagination** — library is fully in localStorage, so all entries are rendered (virtualized scrolling deferred to performance phase)
