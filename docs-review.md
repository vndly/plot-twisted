# Docs Review

## Inconsistencies

### 1. Lazy loading contradiction

- Roadmap `01-menu-scaffold-and-navigation.md` says: *"No lazy loading yet — all route views are eagerly loaded in this phase; code-splitting is deferred to a performance phase"*
- But `technical/architecture.md` (line 140-149) describes route lazy loading as the established pattern, with a code example. These contradict each other.

### 2. "6 navigation-bar routes" doesn't match the nav spec

- Roadmap `01` acceptance criteria says *"All 6 navigation-bar routes"*
- But `technical/ui-ux.md` (line 60-68) lists only **5** nav items (Home, Recommendations, Calendar, Library, Settings). Stats is explicitly excluded from the nav bar.

### 3. Recommendations tab labels vs. actual design

- `technical/ui-ux.md` (line 100) mentions Tab Toggle examples: *"Recommendations: Trending / Genres / Top Rated"*
- But `roadmap/09-recommendations.md` describes a completely different design: *"Because you liked {title}"* sections seeded from the user's library. No mention of those tabs.

### 4. `docs/index.md` description of `project.md` is inaccurate

- Index says: *"App purpose, problem statement, and guiding principles"*
- But `project.md` has no "guiding principles" section.

### 5. `useRecommendations(id)` signature vs. behavior

- `technical/data-model.md` (line 138) defines `useRecommendations(id)` — single ID parameter.
- `roadmap/09-recommendations.md` describes fetching for *"up to 5 seed entries"* — the composable should handle multiple IDs or be called differently than suggested.

## Structural Issues

### 6. Inconsistent roadmap item structure

- Most roadmap items follow a clear template: description, Acceptance Criteria (with checkboxes), Key Decisions.
- `03-entry-details.md` and `05-library-watchlist-and-watched.md` are missing both Acceptance Criteria and Key Decisions. They're noticeably less structured than every other roadmap item.

## Missing Documentation

### 7. Share link

- Roadmap `03` lists *"Share link"* as a feature, but no other document describes how this works (native share API? clipboard URL? deep link format?).

### 8. Stats navigation path

- Stats is excluded from the nav bar (`ui-ux.md` line 68), but there's no documentation on how users actually reach the Stats screen. Presumably a link from Library, but it's undocumented.

### 9. API error responses

- `technical/api.md` documents all endpoints and success response shapes, but says nothing about error responses — status codes, error body shape, or how TMDB reports errors.

### 10. Rate limit handling

- `api.md` mentions TMDB's ~40 req/10s limit, but there's no documentation on what the app does if it hits the limit (retry with backoff? show a toast? silently fail?).

### 11. `*.test.vue` naming

- `technical/testing.md` (line 35) shows `MovieCard.test.vue` as an example. Vitest component tests are typically `.test.ts` files that import and mount the component — `.test.vue` files aren't a standard Vitest convention and may not work as expected.

## Suggestions

### 12. project.md could be richer

The product vision doc is quite brief. It could benefit from:

- Guiding principles / design tenets (since the index already claims they exist)
- Non-goals (what the app explicitly won't do — e.g., no social features, no backend, no user accounts)

### 13. Roadmap status tracking

- All acceptance criteria checkboxes are unchecked. There's no way to tell which phases are done, in progress, or not started. A status indicator per phase would help.
