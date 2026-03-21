# Docs Review

## Inconsistencies

### 1. Architecture component hierarchy is incomplete
`architecture.md` shows the HomeScreen with only `SearchBar`, `TrendingCarousel`, and `PopularGrid`. But roadmap phase 06 adds `FilterBar` and `ViewToggle` to the HomeScreen. These are missing from the hierarchy.

### 2. Entry Details roadmap doc has inconsistent style
`03-entry-details.md` uses informal bullet points with question marks ("Type? (movie/tv)", "Favorite?") while every other roadmap doc uses clean, declarative bullets. This reads like a draft compared to the rest.

### 3. Toast auto-dismiss timing
- `ui-ux.md` Transitions section: "auto-dismiss after 3–5 seconds"
- `ui-ux.md` Error States section: "Auto-dismiss after ~4 seconds"
- `glossary.md`: "Auto-dismisses after ~4 seconds"

Pick one and use it everywhere.

### 4. `defaultHomeSection` is ambiguous
`data-model.md` defines `defaultHomeSection: "trending" | "popular" | "search"` in Settings, but the Home screen (per roadmap 02 + 04) renders search bar, trending, AND popular simultaneously. No document explains what "default section" actually controls — is it which section is scrolled-to on load? Which section appears first?

### 5. `ViewToggle` is undocumented outside roadmap 06
Roadmap 06 introduces a `ViewToggle` component for grid/list switching. It's briefly mentioned in `ui-ux.md`, but is missing from the glossary (UI Components section) and the architecture component hierarchy.

---

## Things to Fix

1. **Clean up `03-entry-details.md`** — Rewrite the informal property list to match the declarative style of the other roadmap docs.
2. **Update `architecture.md` component hierarchy** — Add `FilterBar` and `ViewToggle` under `HomeScreen` to reflect the full feature set.
3. **Standardize toast timing** — Pick "~4 seconds" (already used in 2 of 3 places) and update the transitions section.
4. **Define `defaultHomeSection` behavior** — Add a sentence in roadmap 11 (Settings) or `data-model.md` explaining what this setting does on the Home screen.
5. **Add `ViewToggle` to glossary** — It's a reusable UI component like `Tab Toggle` and deserves an entry.

---

## What's Missing

### Should document

1. **Pagination strategy** — Multiple TMDB endpoints return paginated results (search, trending, popular, recommendations, upcoming). No doc specifies how the app handles multi-page results: infinite scroll? "Load more" button? Single page only? The Library section says "no pagination" for local data, but API-driven screens are unaddressed.
2. **Home screen behavior when search is active vs idle** — What happens when the user clears the search query? Do trending/popular sections reappear? Are search results and trending/popular shown simultaneously or does search replace them?
3. **Security considerations** — The TMDB bearer token handling, XSS prevention for user-provided strings (notes, tags, list names), and localStorage data integrity are only lightly touched. A brief section covering: token exposure risk (it's in client-side code), sanitization approach, and the trust model would be useful.
4. **CI/CD pipeline** — Deployment doc covers only manual `firebase deploy`. No mention of automated testing on push, build validation, or any GitHub Actions/CI setup.

### Could document (lower priority)

5. **Error retry behavior details** — `api.md` mentions exponential backoff (1s, 2s, 4s, max 3 attempts) for rate limiting. Do other error types (500+, network errors) also retry? The automatic vs manual retry boundary isn't clear.
6. **localStorage size limits** — The app stores everything in localStorage (5-10MB limit in most browsers). No doc addresses what happens when the limit is approached or exceeded.
