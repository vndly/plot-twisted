# Recommendations

* "If you liked X" suggestions via `GET /movie/{id}/recommendations` and `GET /tv/{id}/recommendations`
* Seed entries are chosen from the user's highest-rated or most recently watched items
* Falls back to trending/popular sections when the library is empty

## Acceptance Criteria

- [ ] Recommendations are fetched for up to 5 seed entries from the user's library (highest-rated first)
- [ ] Results are deduplicated across seeds and exclude entries already in the library
- [ ] Each recommendation section is labeled "Because you liked {title}"
- [ ] Fallback to trending/popular content when there are no library entries to seed from
- [ ] Loading and error states handled per section independently

## Key Decisions

* **Seed selection: top-rated over recent** — highly rated entries are better taste signals than recency
* **Deduplication is client-side** — API may return the same movie from multiple seeds; filter by provider ID before rendering
