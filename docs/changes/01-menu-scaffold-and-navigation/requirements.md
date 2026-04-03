---
id: R-01b
title: Menu Scaffold and Navigation
status: review
type: functional
importance: medium
tags: []
---

## Intent

Complete the remaining route surface from the Menu Scaffold and Navigation roadmap item by extending the existing scaffolded shell to cover Recommendations as the fifth primary navigation route and by adding placeholder routes for Stats and Movie/Show detail pages.

This change exists to finish the unfinished routing and placeholder work without pulling in the full feature behavior from the later Entry Details, Stats, and Recommendations roadmap items.

## Context & Background

### Problem Statement

The current scaffold only ships Home, Calendar, Library, and Settings. The route surface described in the roadmap and architecture still lacks `/recommendations`, `/stats`, `/movie/:id`, and `/show/:id`.

As a result, the app shell and router are only partially complete: the primary navigation does not yet expose Recommendations, and direct URLs for Stats and detail pages do not resolve to intentional placeholder screens inside the shared shell.

### User Stories

- As a user, I can open Recommendations from the primary navigation even before recommendation logic is implemented.
- As a user, direct URLs for Stats and movie/show detail pages resolve to placeholder screens inside the app shell instead of falling back to unrelated routes.
- As a developer, I can build future Entry Details, Stats, and Recommendations features on top of stable named routes and placeholder screens rather than adding routing and feature logic at the same time.

### Personas

- **End user**: Navigates the scaffolded app shell and expects every exposed route to land on an intentional screen, even when the feature body is still a placeholder.
- **Feature implementer**: Builds the later Entry Details, Stats, and Recommendations roadmap items and benefits from stable route definitions, title keys, and placeholder screens already being in place.

### Dependencies

- `R-00` Project Setup is complete.
- `R-01a` App Scaffolding is complete and already provides the shell, page header, error boundary, route transitions, `EmptyState`, and router test infrastructure.
- Existing localized keys `nav.recommendations` and `page.recommendations.title` already exist in all supported locales.

### Affected Existing Product Docs

- `docs/product/01 - scaffolding/requirements.md` currently treats `/recommendations`, `/stats`, and detail routes as deferred. If this change is implemented and promoted, that product spec will need to be updated to reflect the new route surface.

## Decisions

| Decision                   | Choice                                                                                                                                                | Rationale                                                                                                                 |
| :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| Route ownership            | This change adds route definitions, placeholder views, Recommendations nav integration, and tests only.                                               | Keeps scope aligned with the unfinished roadmap item and avoids accidentally implementing full future features.           |
| Primary navigation surface | Recommendations becomes the fifth primary nav item. Stats and detail routes remain non-nav destinations.                                              | Matches `docs/technical/ui-ux.md`, which explicitly excludes Stats and detail routes from primary navigation.             |
| Recommendations nav order  | Home, Recommendations, Calendar, Library, Settings                                                                                                    | The released scaffolding docs already reserved this insertion point for Recommendations.                                  |
| Placeholder strategy       | New routes reuse the existing `EmptyState` primitive with shared translated placeholder copy and route-specific icons.                                | Keeps the implementation consistent with the existing scaffold and avoids inventing feature-specific placeholder content. |
| Detail route validation    | `/movie/:id` and `/show/:id` accept numeric IDs only; non-numeric params redirect to `/`.                                                             | Aligns with `docs/technical/architecture.md` and prevents invalid placeholder URLs from becoming valid app states.        |
| Route titles               | Recommendations reuses `page.recommendations.title`. Stats and detail placeholders add `page.stats.title`, `page.movie.title`, and `page.show.title`. | Preserves the existing `PageHeader` and `document.title` contract across all routes.                                      |

## Scope

### In Scope

- Add lazy-loaded `/recommendations`, `/stats`, `/movie/:id`, and `/show/:id` routes to `src/presentation/router.ts`.
- Add a Recommendations nav item to both desktop and mobile navigation components.
- Insert Recommendations between Home and Calendar in both nav surfaces.
- Keep `/stats`, `/movie/:id`, and `/show/:id` reachable by direct URL and router navigation without adding them to primary navigation.
- Add placeholder view components for Recommendations, Stats, Movie Details, and Show Details using the existing `EmptyState` primitive and shared placeholder copy.
- Add translated page-title keys required for Stats and detail placeholders across all supported locales.
- Extend `PageHeader` and `document.title` coverage to the new routes through route metadata.
- Add route guards rejecting non-numeric detail IDs and redirecting invalid URLs to Home.
- Extend router, nav, shell, and view tests to cover the new routes, nav order, guard behavior, placeholder rendering, and placeholder-only behavior.

### Out of Scope

- Recommendation fetching, seed selection, deduplication, or fallback content from roadmap 09.
- Stats computation, charts, reactive library analytics, or a Library-to-Stats entry point from roadmap 08.
- Detail-page metadata, trailers, providers, ratings, favorites, watch status, or share behavior from roadmap 03.
- Wiring Home or Library cards to navigate to detail routes in this change.
- New application, infrastructure, or domain abstractions for placeholder-only screens.
- New dependencies, chart libraries, TMDB API calls, or persisted placeholder-route data.
- New full-page layouts that replace the existing `AppShell`, `PageHeader`, overlays, or `ErrorBoundary`.

## Functional Requirements

| ID       | Requirement                | Description                                                                                                                                                                                                                                                                                                                          | Priority |
| :------- | :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| R-01b-01 | Recommendations route      | The router defines a named `recommendations` route at `/recommendations` using lazy loading and `meta.titleKey: 'page.recommendations.title'`. The route renders a placeholder view inside the existing shell.                                                                                                                       | P0       |
| R-01b-02 | Recommendations nav item   | Desktop sidebar and mobile bottom nav render a fifth primary nav item for `/recommendations` with the translated `nav.recommendations` label, the Lucide `Compass` icon, existing active-state styling, and exact placement between Home and Calendar.                                                                               | P0       |
| R-01b-03 | Stats placeholder route    | The router defines a named `stats` route at `/stats` using lazy loading and `meta.titleKey: 'page.stats.title'`. The route is directly navigable by URL and renders a placeholder view inside the existing shell, but it is not added to the primary nav.                                                                            | P0       |
| R-01b-04 | Detail placeholder routes  | The router defines named `movie` and `show` routes at `/movie/:id` and `/show/:id` using lazy loading and `meta.titleKey` values `page.movie.title` and `page.show.title`. Each route renders a placeholder detail screen inside the existing shell and accepts a numeric provider ID param for direct navigation.                   | P0       |
| R-01b-05 | Detail ID guards           | Navigation guards reject non-numeric `:id` params for `/movie/:id` and `/show/:id` and redirect invalid routes to `/` before rendering a placeholder screen. Valid numeric IDs continue to the placeholder routes.                                                                                                                   | P0       |
| R-01b-06 | Placeholder view rendering | Recommendations, Stats, Movie Details, and Show Details each render the shared `EmptyState` component using Lucide `Compass`, `ChartColumn`, `Film`, and `Tv` icons respectively, plus translated `common.empty.title` and `common.empty.description` copy. Route titles remain owned by route metadata and the shared `PageHeader`. | P0       |
| R-01b-07 | New-route shell behavior   | All newly added routes render beneath the existing `PageHeader`, preserve the desktop sidebar/mobile bottom-nav responsive behavior, keep overlays available, and use the existing route transition contract rather than introducing route-specific full-page takeovers.                                                             | P1       |
| R-01b-08 | Verification coverage      | The Vitest suites under `tests/` are extended to cover the new router definitions, invalid-ID redirects, Recommendations nav rendering and active state, absence of Stats/detail routes from primary navigation, placeholder-only behavior, and placeholder view output for the four new routes.                                     | P0       |

## Non-Functional Requirements

### Responsive Design

- `NFR-01b-01` — On viewports below `md`, the Recommendations bottom-nav item must keep the same 44x44px minimum touch target already required for the current nav items.
- `NFR-01b-02` — On viewports `md` and above, the content column for Recommendations, Stats, and detail placeholders must remain offset from the fixed sidebar exactly as the current shell does for existing routes.
- `NFR-01b-03` — No new route may bypass the shared shell chrome; sidebar/header/bottom-nav visibility must continue to follow the existing breakpoint rules.

### Internationalization

- `NFR-01b-04` — `page.stats.title`, `page.movie.title`, and `page.show.title` must exist in `en.json`, `es.json`, and `fr.json` with identical flat-key structure and no missing-key fallbacks in automated tests.
- `NFR-01b-05` — Recommendations, Stats, and detail placeholder implementations must contain zero hardcoded user-facing strings; all visible text must come from vue-i18n keys or pre-translated props passed to shared components.

### Performance

- `NFR-01b-06` — `/recommendations`, `/stats`, `/movie/:id`, and `/show/:id` must each be route-level lazy imports so no new placeholder screen code is added to the initial route bundle.
- `NFR-01b-07` — Mounting any placeholder route in this change must trigger zero TMDB API requests and zero localStorage writes.

### Testing

- `NFR-01b-08` — Automated coverage for this change must include router tests, layout/component tests, and placeholder-view tests in the mirrored `tests/` structure using the AAA pattern.
- `NFR-01b-09` — Verification must pass via `npm run type-check`, `npm run lint`, `npm run format:check`, and `npm run test` after implementation.

## Constraints

- Use only the existing approved stack already in the repo: Vue 3, Vue Router, vue-i18n, Tailwind CSS, Lucide, Vitest, and existing shared scaffold components.
- Keep all new route views and nav changes in the Presentation layer. Do not introduce new Application, Infrastructure, or Domain abstractions for placeholder-only screens.
- Reuse the existing `EmptyState`, `PageHeader`, `AppShell`, `ErrorBoundary`, and fade transition behavior rather than creating parallel placeholder scaffolding.
- Recommendations is the only new primary nav item in this change. Stats and detail routes must not appear in the primary nav.
- This change must not add TMDB endpoint usage, storage schema changes, or new persisted user data.

## UI/UX Specs

- Recommendations appears in both nav surfaces with icon + label on desktop and icon + short label on mobile, using the same accent and active styling as the existing four nav items.
- The documented primary-nav order becomes Home, Recommendations, Calendar, Library, Settings.
- Stats renders as a shell-contained placeholder screen and remains a secondary destination rather than a primary nav item.
- Movie and Show detail placeholders render inside the normal content column with the existing page header visible above the placeholder body.
- Placeholder icons use Lucide `Compass` for Recommendations, `ChartColumn` for Stats, `Film` for Movie Details, and `Tv` for Show Details.
- Route transitions for all new screens reuse the existing 200ms opacity fade and reduced-motion behavior.

## Risks & Assumptions

- **Risk:** The roadmap file mixes primary-nav routes with non-nav/detail routes, which can cause accidental over-scoping. **Likelihood:** High. **Impact:** Medium. **Mitigation:** This change explicitly limits primary navigation changes to Recommendations and keeps Stats/detail routes direct-only.
- **Risk:** Future roadmap items 03, 08, and 09 may want different title keys or icon choices. **Likelihood:** Medium. **Impact:** Low. **Mitigation:** Keep placeholder requirements minimal and isolated to route scaffolding rather than feature-specific content.
- **Assumption:** `nav.recommendations` and `page.recommendations.title` remain the correct localization keys for the Recommendations route.
- **Assumption:** `page.stats.title`, `page.movie.title`, and `page.show.title` are the correct localization keys for the new placeholder routes.
- **Assumption:** Direct URL access is sufficient to count `/stats`, `/movie/:id`, and `/show/:id` as navigable within this roadmap-completion change.
- **Assumption:** Route-level overlap with future roadmap items 03, 08, and 09 is intentional so long as this change stays placeholder-only.

## Acceptance Criteria

- [ ] `/recommendations` resolves as a lazy-loaded named route and renders a placeholder view inside the existing shell.
- [ ] Desktop sidebar and mobile bottom nav both render Recommendations between Home and Calendar, using translated labels and existing active-state behavior.
- [ ] The Recommendations mobile nav item preserves the existing 44x44px minimum touch target behavior.
- [ ] `/stats` resolves by direct URL, renders a placeholder inside the existing shell, and does not appear in primary navigation.
- [ ] `/movie/550` and `/show/1396` resolve by direct URL and render placeholder screens inside the existing shell.
- [ ] `/movie/abc` and `/show/abc` redirect to `/` instead of rendering a placeholder screen.
- [ ] `PageHeader` and `document.title` update correctly for Recommendations, Stats, Movie, and Show placeholder routes using translated page-title keys.
- [ ] All new page-title keys exist in `en.json`, `es.json`, and `fr.json`, and automated tests verify the key structure without relying on fallback output.
- [ ] All four new placeholder views render `EmptyState` with translated `common.empty.title` and `common.empty.description` copy, using Lucide `Compass`, `ChartColumn`, `Film`, and `Tv` icons respectively, with no hardcoded user-facing strings in the view implementations.
- [ ] Navigating to any new placeholder route keeps the existing shell chrome and overlays visible and performs zero TMDB API requests and zero localStorage writes.
- [ ] New placeholder screens are route-level lazy imports rather than eager additions to the initial route bundle.
- [ ] Automated tests cover the new router definitions, invalid-ID guard behavior, nav composition/order, and placeholder view rendering, and `npm run type-check`, `npm run lint`, `npm run format:check`, and `npm run test` pass after implementation.
