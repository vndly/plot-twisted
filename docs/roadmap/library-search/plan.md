# Plan: Library Search

Adds volatile, client-side Library search across validated `LibraryEntry.title`, `LibraryEntry.tags`, and `LibraryEntry.notes`, composed with existing Library filters and sort.

## Phase 1: Test Contracts

1. [x] **Domain schema tests**: Add failing tests in `tests/domain/library-search.schema.test.ts` for `LibrarySearchQuerySchema` string parsing, leading/trailing whitespace trimming, 120-character truncation after trimming, lowercase transform, whitespace-only empty output, and literal preservation of internal whitespace/special characters covering: LBS-05-01, LBS-05-02, LBS-05-03, LBS-05-04, LBS-05-05, plus `(implementation detail: schema boundary constraints)`.
2. [x] **Domain search logic tests**: Add failing tests in `tests/domain/library-search.logic.test.ts` for `filterLibraryEntriesBySearchQuery`, lowercasing of the normalized query and each searchable `LibraryEntry.title`, `LibraryEntry.tags`, and `LibraryEntry.notes` field before `String.includes` matching, partial matching, and status-scope exclusion covering: LBS-02-02, LBS-02-04, LBS-03-01, LBS-04-01, plus `(implementation detail: pure search/filter Performance NFR 500-entry < 50ms threshold)`.
3. [x] **Library search composable tests**: Add failing tests in `tests/application/use-library-search.test.ts` with fake timers for 300ms debounce, immediate clear behavior, stale debounce cancellation, and volatile in-memory state covering: LBS-02-01, LBS-06-02, LBS-09-02, LBS-10-02.
4. [x] **Library entries composition tests**: Extend `tests/application/use-library-entries.test.ts` with failing cases proving search applies to `LibraryEntry` data before `toLibraryViewItem`, excludes matching `status: "none"` entries from Watchlist/Watched tab results, combines with genre/media type/rating filters and sorting, and recomputes a 500-entry search/filter result in `< 50ms` after debounce covering: LBS-02-02, LBS-02-03, LBS-02-04, LBS-07-01, LBS-07-02, plus `(implementation detail: composable recomputation Performance NFR threshold)`.
5. [x] **Library search bar component tests**: Add failing tests in `tests/presentation/components/library/library-search-bar.test.ts` for placeholder/i18n, mirrored locale key usage, accessible label, `maxlength="120"`, clear-button visibility, 44x44 clear target, focus return, `update:modelValue` emission, `clear` emission, Enter prevention, and Escape-key clear emission covering: LBS-01-01, LBS-01-03, LBS-05-01, LBS-06-01, LBS-10-01, plus `(implementation detail: Escape emits clear without testing debounce cancellation)`.
6. [x] **Library screen integration tests**: Extend `tests/presentation/views/library-screen.test.ts` with failing cases for sticky-controls placement, mobile/desktop responsive classes, no autofocus on page load, search/filter empty-state behavior for Watchlist and Watched tabs, contextual CTA clearing, non-default locale empty-state/CTA text, tab-state retention, `status: "none"` exclusion from base/search scopes, and active-filter preservation after clear/Escape covering: LBS-01-01, LBS-01-02, LBS-02-04, LBS-08-01, LBS-08-02, LBS-08-03, LBS-09-01, LBS-06-03, LBS-10-03.
7. [x] **Confirm test-first failure**: Run `npm run test -- tests/domain/library-search.schema.test.ts tests/domain/library-search.logic.test.ts tests/application/use-library-search.test.ts tests/application/use-library-entries.test.ts tests/presentation/components/library/library-search-bar.test.ts tests/presentation/views/library-screen.test.ts` and confirm the new tests fail for missing behavior before implementation `(implementation detail: test-first guard)`.

## Phase 2: Domain and Application Implementation

1. [x] **Add domain schema and pure search logic**: Create `src/domain/library-search.schema.ts` with `LibrarySearchQuerySchema` and `LibrarySearchQuery`; create `src/domain/library-search.logic.ts` with `normalizeLibrarySearchQuery`, `matchesLibrarySearchQuery`, and `filterLibraryEntriesBySearchQuery`. Normalize by Zod parsing, trimming, truncating to 120 characters after trimming, and `toLowerCase()`; preserve internal whitespace; lowercase `LibraryEntry.title`, each tag, and notes before literal `String.includes` comparison; use `String.includes`, never `RegExp`.
2. [x] **Add debounced Library search state**: Create `src/application/use-library-search.ts exposing `query`, `appliedQuery`, `hasSearchQuery`, `setQuery`, and `clearSearch`. Use existing `SEARCH_DEBOUNCE_MS = 300`, cancel pending timers on replacement/clear, and keep state in memory only.
3. [x] **Compose search into Library entries**: Update `src/application/use-library-entries.ts` to accept optional `searchQuery?: Ref<string>`, filter `allEntries.value` with domain search before projection, then apply existing `matchesLibraryFilters` and `getLibraryComparator`. Preserve existing callers by keeping the new argument optional.
4. [x] **Run targeted application/domain tests**: Run the Phase 1 domain/application tests and fix only issues within the Library search scope.

## Phase 3: Presentation and i18n Implementation

1. [x] **Create presentation-only search input**: Add `src/presentation/components/library/library-search-bar.vue` using `<script setup lang="ts">`, lucide `Search` and `X`, localized placeholder/labels, native `input type="search"` with `maxlength="120"`, `@keydown.enter.prevent`, `@keydown.escape.prevent`, and a clear button with at least `size-11`. Define the contract explicitly as `modelValue: string`, `update:modelValue` for typing, `clear` for clear-button/Escape intent, and focus return to the input after clear.
2. [x] **Integrate search into Library screen controls**: Update `src/presentation/views/library-screen.vue` to use `useLibrarySearch()`, pass `appliedQuery` into `useLibraryEntries`, render `LibrarySearchBar` in the sticky controls area, and use responsive Tailwind layout so search is full-width above filters below `md` and inline with filters at `md` and above.
3. [x] **Implement search/filter empty-state logic**: In `library-screen.vue`, preserve base Watchlist/Watched empty states when the selected tab has no base entries. When a non-empty tab scope is reduced to zero by search and/or filters, show a localized search/filter empty state with contextual CTA: clear search, clear filters, or clear all.
4. [x] **Add translations**: Update `src/presentation/i18n/locales/en.json`, `es.json`, and `fr.json` with `library.search.*` and search/filter empty-state CTA keys. Keep all locale files structurally aligned.
5. [x] **Run targeted presentation tests**: Run the Phase 1 presentation tests and fix only Library search regressions.

## Phase 4: Regression Verification

1. [x] **Run locale-key validation**: Run `npm run test -- tests/presentation/i18n/locale-keys.test.ts`.
2. [x] **Run affected Library tests**: Run `npm run test -- tests/domain/library-search.schema.test.ts tests/domain/library-search.logic.test.ts tests/application/use-library-search.test.ts tests/application/use-library-entries.test.ts tests/presentation/components/library/library-search-bar.test.ts tests/presentation/views/library-screen.test.ts`.
3. [x] **Run broader filter regressions**: Run `npm run test -- tests/domain/filter.logic.test.ts tests/application/use-library-filters.test.ts tests/presentation/components/common/filter-bar.test.ts`.
4. [x] **Manual responsive check**: Run `npm run dev`, open `/library`, and verify at 390px and 1024px viewport widths that search placement, clear-button target, sticky controls, focus behavior, and empty-state CTA behavior match the requirements.

## Phase 5: Promotion Documentation

1. [ ] **Product documentation handoff**: When promoted, update `docs/product/03 - library` sections for library controls, filter composition, filtered empty states, responsive layout, and `useLibraryEntries` behavior.
2. [ ] **Migration note**: Confirm the promoted documentation states that Library search adds volatile UI state only and requires no persisted schema migration, schema version bump, or rollback path.

## Phase 6: Final Verification

1. [ ] **Format**: Run `npm run format`.
2. [ ] **Lint**: Run `npm run lint`.
3. [ ] **Type-check**: Run `npm run type-check`.
4. [ ] **Full test suite**: Run `npm run test`.
5. [ ] **Build**: Run `npm run build`.
6. [ ] **Final formatting check**: Run `npm run format:check`.
