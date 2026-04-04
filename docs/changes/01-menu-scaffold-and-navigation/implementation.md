# Implementation: Menu Scaffold and Navigation

## Overview

This implementation extends the existing scaffolded shell to include Recommendations as the fifth primary navigation route and adds placeholder routes for Stats, Movie details, and Show details. The approach follows a test-first methodology with comprehensive Phase 1/3 test writing before Phase 2/4 implementation, ensuring all new routes integrate seamlessly with the existing shell, transitions, and localization infrastructure.

The implementation reuses the existing `EmptyState` component with route-specific Lucide icons for all placeholder screens, keeping the codebase consistent with the established scaffold pattern. Numeric ID validation guards protect detail routes from invalid inputs by redirecting non-numeric IDs to the home route.

## Files Changed

### Created

- `src/presentation/views/recommendations-screen.vue` — Placeholder view for `/recommendations` using `EmptyState` with `Compass` icon
- `src/presentation/views/stats-screen.vue` — Placeholder view for `/stats` using `EmptyState` with `ChartColumn` icon
- `src/presentation/views/movie-screen.vue` — Placeholder view for `/movie/:id` using `EmptyState` with `Film` icon
- `src/presentation/views/show-screen.vue` — Placeholder view for `/show/:id` using `EmptyState` with `Tv` icon
- `tests/presentation/views/recommendations-screen.test.ts` — Component tests for RecommendationsScreen
- `tests/presentation/views/stats-screen.test.ts` — Component tests for StatsScreen
- `tests/presentation/views/movie-screen.test.ts` — Component tests for MovieScreen
- `tests/presentation/views/show-screen.test.ts` — Component tests for ShowScreen

### Modified

- `src/presentation/router.ts` — Added 4 new lazy-loaded routes (`recommendations`, `stats`, `movie`, `show`) with `numericIdGuard` for detail routes
- `src/presentation/i18n/locales/en.json` — Added `page.stats.title`, `page.movie.title`, `page.show.title`
- `src/presentation/i18n/locales/es.json` — Added Spanish translations for new page titles
- `src/presentation/i18n/locales/fr.json` — Added French translations for new page titles
- `src/presentation/components/layout/sidebar-nav.vue` — Added Recommendations nav item with `Compass` icon between Home and Calendar
- `src/presentation/components/layout/bottom-nav.vue` — Added Recommendations nav item with `Compass` icon between Home and Calendar
- `tests/presentation/i18n/locale-keys.test.ts` — Updated expected key count from 21 to 24; added 3 new keys
- `tests/presentation/router.test.ts` — Extended for 8 routes, numeric guards, and new title metadata
- `tests/presentation/components/layout/sidebar-nav.test.ts` — Updated for 5 nav items with Recommendations
- `tests/presentation/components/layout/bottom-nav.test.ts` — Updated for 5 nav items with Recommendations
- `tests/presentation/components/layout/page-header.test.ts` — Added test cases for new routes
- `tests/presentation/components/layout/app-shell.test.ts` — Added shell tests for new routes and no-side-effects validation
- `tests/App.test.ts` — Updated to expect 5 nav items with Recommendations

## Key Decisions

- **Shared `numericIdGuard`**: Extracted a reusable guard function in `router.ts` that validates `:id` params contain digits only (`/^\d+$/`). Both `/movie/:id` and `/show/:id` use this guard to redirect invalid IDs to home before rendering.

- **Route ordering**: Primary nav routes are ordered as `home`, `recommendations`, `calendar`, `library`, `settings` per the documented design. Non-nav routes (`stats`, `movie`, `show`) are appended after settings and before the catch-all redirect.

- **Placeholder icon mapping**: Each placeholder screen uses a distinct Lucide icon (`Compass` for Recommendations, `ChartColumn` for Stats, `Film` for Movie, `Tv` for Show) passed to the shared `EmptyState` component.

- **No provider calls**: Placeholder screens render immediately without any TMDB API calls or localStorage writes, verified by spying on `fetch` and `Storage.prototype.setItem`/`removeItem` in tests.

## Deviations from Plan

None — implementation followed the plan exactly.

## Testing

### Test Files Created/Modified

| File                                                       | Coverage                                                        |
| ---------------------------------------------------------- | --------------------------------------------------------------- |
| `tests/presentation/i18n/locale-keys.test.ts`              | New page-title keys across all locales                          |
| `tests/presentation/router.test.ts`                        | Route definitions, lazy loading, title metadata, numeric guards |
| `tests/presentation/components/layout/sidebar-nav.test.ts` | 5 nav items, Recommendations order/icon/styling                 |
| `tests/presentation/components/layout/bottom-nav.test.ts`  | 5 nav items, touch targets, Recommendations styling             |
| `tests/presentation/components/layout/page-header.test.ts` | Page titles for all 4 new routes                                |
| `tests/presentation/components/layout/app-shell.test.ts`   | Shell rendering, transitions, no-side-effects for new routes    |
| `tests/presentation/views/recommendations-screen.test.ts`  | EmptyState, Compass icon, i18n bindings                         |
| `tests/presentation/views/stats-screen.test.ts`            | EmptyState, ChartColumn icon, i18n bindings                     |
| `tests/presentation/views/movie-screen.test.ts`            | EmptyState, Film icon, i18n bindings                            |
| `tests/presentation/views/show-screen.test.ts`             | EmptyState, Tv icon, i18n bindings                              |
| `tests/App.test.ts`                                        | Updated for 5 nav items                                         |

### Verification Results

- `npm run type-check` — PASS
- `npm run lint` — PASS
- `npm run format:check` — PASS
- `npm run test` — PASS (181 tests)

### Edge Cases Covered

- Non-numeric detail IDs (`/movie/abc`, `/show/abc`) redirect to `/`
- Empty detail IDs (`/movie/`, `/show/`) redirect to `/`
- Mixed alphanumeric IDs (`/movie/123ab`) redirect to `/`
- Decimal IDs (`/show/12.5`) redirect to `/`
- Valid numeric IDs (`/movie/550`, `/show/1396`) render placeholder

## Dependencies

No new dependencies added.

## Known Limitations

- **Placeholder-only**: Detail routes do not fetch TMDB data or validate provider existence. The [Entry Details](../../roadmap/03-entry-details.md) roadmap item will add provider-backed detail loading and inline not-found handling.

- **Stats access**: The `/stats` route is direct-URL-only; the Library "View Stats" entry path remains deferred to [Stats](../../roadmap/08-stats.md).

- **Recommendations logic**: The `/recommendations` route displays a placeholder; provider-backed seed selection, fetching, and deduplication remain deferred to [Recommendations](../../roadmap/09-recommendations.md).
