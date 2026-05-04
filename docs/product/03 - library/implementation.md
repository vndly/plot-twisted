# Implementation: Library Management, Sorting, Filtering, and Search

## Overview

The Library Management system provides users with a focused set of tools to organize and discover their media collection. It implements categorization into "Watchlist" and "Watched" statuses plus advanced client-side sorting, filtering, and search. The implementation follows the project's 4-layer architecture, ensuring strict separation between UI, orchestration, business rules, and persistence.

Key highlights:

- **Local-first persistence**: All data is stored in `localStorage` with Zod validation.
- **Advanced Filtering/Sorting**: Logic runs locally on metadata snapshots, ensuring instantaneous responses (< 50ms).
- **Shared UI Components**: Extracted a generic `FilterBar` to maintain consistency between Home and Library screens.
- **Status Integration**: Watchlist and watched controls are integrated into individual detail screens.
- **Library Search**: Volatile, client-side search capability for filtering by title, tags, and notes with real-time feedback and debounced processing.

## Files Changed

### Created

- `src/domain/settings.schema.ts` — Canonical settings schema for preferences.
- `src/application/use-library-entries.ts` — Composable for filtering and retrieving library entries.
- `src/application/use-library-filters.ts` — Orchestrates library-specific filter state.
- `src/application/use-sort.ts` — Manages persistent library sort preferences.
- `src/application/use-genres.ts` — Shared composable for caching genres in memory.
- `src/presentation/components/common/tab-toggle.vue` — Reusable tab switcher.
- `src/presentation/components/common/entry-grid.vue` — Responsive grid for cards.
- `src/presentation/components/common/filter-bar.vue` — Generic presentation-only filter bar.
- `src/presentation/components/common/sort-dropdown.vue` — Localized sorting control.
- `src/domain/library-search.schema.ts` — Zod schema for search query normalization (trimming, 120-char truncation, lowercasing).
- `src/domain/library-search.logic.ts` — Pure domain logic for literal string matching across title, tags, and notes.
- `src/application/use-library-search.ts` — Composable managing volatile search state with a 300ms debounce.
- `src/presentation/components/common/search-bar.vue` — Refactored, generic search input component shared with the Home screen.
- `tests/domain/library-search.schema.test.ts` — Unit tests for query normalization.
- `tests/domain/library-search.logic.test.ts` — Unit tests for search matching and performance thresholds.
- `tests/application/use-library-search.test.ts` — Tests for debounce, stale timer cancellation, and state management.
- `tests/presentation/components/common/search-bar.test.ts` — Refactored component tests for interaction, focus, and i18n.

### Modified

- `src/domain/library.schema.ts` — Updated `LibraryEntrySchema` with `voteAverage`, `releaseDate`, and `genreIds`.
- `src/domain/filter.schema.ts` — Added `LibraryFilterStateSchema`, `SortField`, and `SortOrder`.
- `src/domain/filter.logic.ts` — Added predicates and comparators for library logic.
- `src/infrastructure/storage.service.ts` — Added methods for settings persistence and metadata snapshots.
- `src/application/use-settings.ts` — Migrated to the new canonical settings object.
- `src/presentation/views/library-screen.vue` — Implemented the full dashboard with sticky filters, sorting, and search. Integrated the full-width search bar and refactored controls layout (Genre/Type on left, Sort/Rating on right).
- `src/presentation/views/movie-screen.vue` & `show-screen.vue` — Integrated status controls and metadata capture.
- `src/application/use-library-entries.ts` — Integrated search filtering into the library data flow before projection.
- `src/presentation/components/common/filter-bar.vue` — Added `hideClear` prop to support split-row layouts.
- `src/presentation/views/home-screen.vue` — Updated to use the generic `SearchBar` component.
- `src/presentation/i18n/locales/en.json`, `es.json`, `fr.json` — Added search and empty-state translations.
- `tests/application/use-library-entries.test.ts` — Added search composition regression tests.
- `tests/presentation/views/library-screen.test.ts` — Added integration tests for search and empty states.

## Key Decisions

- **Metadata Snapshotting**: Storing `voteAverage`, `releaseDate`, and `genreIds` directly in `LibraryEntry` avoids expensive API calls during rendering and allows fully local sorting/filtering.
- **Canonical Settings Object**: Grouped standalone settings into a single `settings` object in `localStorage` for better maintainability.
- **Shared FilterBar**: Extracted UI patterns into a shared component to ensure visual consistency while keeping Library state isolated from Home's URL-synced state.
- **AND Logic for Filters**: Filters refine the currently active tab rather than replacing it.
- **Search before Projection**: Search matching is performed against raw `LibraryEntry` data (where tags and notes are available) before it is projected to `LibraryViewItem`. This keeps the presentation model lean while allowing rich search.
- **Volatile State**: Search query is kept in memory only and is not persisted to `localStorage` or synced to the URL, as per requirements.
- **Literal Matching**: Matching uses `String.includes` for predictability and performance, avoiding the complexities and risks of regular expressions.
- **Contextual Empty States**: The empty state dynamically updates its title, description, and CTA based on whether search, filters, or both are active.

## Deviations from Plan

- **useGenres Composable**: Added to share genre caching between screens, which was identified as a technical necessity during implementation.
- **Metadata Redundancy**: Expanded the snapshot beyond the initial plan to support the full range of requirements for card rendering and sorting.
- **camelCase i18n keys**: Renamed `library.search.clear_all` to `library.search.clearAll` to comply with the project's segment-naming convention identified during locale-key validation.

## Testing

- **Domain**: 100% coverage for schemas, predicates, and comparators. Comprehensive coverage of normalization rules and case-insensitive matching for search.
- **Infrastructure**: Verified library entry CRUD and settings migration.
- **Application**: Verified reactive composition of the library dataset with active filters and sort. Verified 300ms debounce behavior, timer cleanup, and composition with existing filters for search.
- **Presentation**: Verified tab switching, grid rendering, sticky behavior, and empty states. Verified responsive placement, clear-button touch targets (size-11/44px), and accessibility labels for search.
- **Performance**: Confirmed filtering and sorting on 500 entries completes in ~2ms. Confirmed search filtering 500 entries takes < 50ms on the application layer.
- **i18n**: Verified key parity and camelCase compliance across all supported locales.

## Dependencies

- **lucide-vue-next**: Core icon set.
- **vue-i18n**: Localization.
- **chart.js & vue-chartjs**: (Note: used by Stats feature, but integrated with Library data).

## Internationalization

- Full support for English, Spanish, and French.
- Specialized attention to localized sort labels (e.g., "Date d'ajout").
