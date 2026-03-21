# Documentation Fixes Plan

## Phase 1: Straightforward Fixes

### 1.1 Typos and heading level
- `docs/roadmap/03-entry-details.md`: "Sinopsis" → "Synopsis"
- `docs/roadmap/03-entry-details.md`: "Peggy rating" → "TMDB rating" (duplicate of line 16, or clarify intent — ask user)
- `docs/project.md`: Change `##` title to `#`

### 1.2 Remove stale API references
- `docs/technical/api.md`: Remove OMDB API and IMDB API from "External API References" section (neither is used)

### 1.3 Resolve route/screen naming
- Decide: rename the route from `/recommendations` to `/discover`, or rename the UI label from "Discover" to "Recommendations"
- Update all references across: `architecture.md` (routing table, component hierarchy), `ui-ux.md` (nav items), `roadmap/09-recommendations.md`, `glossary.md`

### 1.4 Resolve search bar scope
- Decide: is the search bar global (all screens) or Home-only?
- Update `architecture.md` component hierarchy and `ui-ux.md` Section 4 to match

### 1.5 Fix composable naming
- `architecture.md`: Change `useWatchlist.ts` example to `useLibrary.ts` to match `data-model.md`

### 1.6 Complete the composable list in data-model.md
- Add missing composables that map to roadmap features: `useRecommendations`, `useUpcoming`, `useStats`, `useSettings`, `useLists`

## Phase 2: Missing Documentation

### 2.1 New file: `docs/technical/setup.md`
Covers:
- Prerequisites (Node.js version, package manager)
- Install dependencies
- Environment configuration (`.env` file with `VITE_TMDB_TOKEN`, how to get a TMDB API key)
- Dev server, build, lint, test commands
- Add entry to `docs/technical/index.md`

### 2.2 New file: `docs/technical/deployment.md`
Covers:
- Firebase Hosting project setup
- Build and deploy commands
- Add entry to `docs/technical/index.md`

### 2.3 Add cache strategy section to `docs/technical/architecture.md`
Covers:
- TTL values per data type
- Cache key format
- Eviction strategy

### 2.4 Add circuit breaker section to `docs/technical/architecture.md`
Covers:
- Failure threshold
- Cooldown period
- Recovery behavior

### 2.5 Add schema migration section to `docs/technical/data-model.md`
Covers:
- How to add a new migration
- What triggers migration on startup
- Version bump rules

### 2.6 Add custom list CRUD to roadmap
- Either expand `docs/roadmap/05-library-watchlist-and-watched.md` or create a new phase for custom list management

### 2.7 Add import/export spec to data-model or settings roadmap
- Define export JSON format
- Define import validation rules

### 2.8 New file: `docs/technical/testing.md`
Covers:
- How to run tests
- Coverage expectations
- Test file structure examples
- Add entry to `docs/technical/index.md`
