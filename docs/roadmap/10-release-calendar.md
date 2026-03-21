# Release Calendar Sync

* Calendar view showing upcoming movie releases via `GET /movie/upcoming`
* Filterable by the user's preferred region (from Settings)
* **Key components:** CalendarGrid, ReleaseCard

## Acceptance Criteria

- [ ] `CalendarGrid` renders a month view with days as cells
- [ ] `ReleaseCard` items are placed on the day matching their `release_date`
- [ ] Month navigation (previous/next) re-fetches data for the visible date range
- [ ] Region filter uses the `region` query parameter from the user's preferred region setting
- [ ] Tapping a `ReleaseCard` navigates to the entry's detail page
- [ ] Empty months show a "No upcoming releases" message

## Key Decisions

* **Movies only** — The media provider's `/movie/upcoming` has no TV equivalent; TV release tracking is out of scope
* **Region from Settings** — the `region` parameter comes from the user's preferred region configured in phase 11
