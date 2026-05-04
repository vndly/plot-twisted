---
id: R-05
title: 'Library Management: Sorting and Filtering'
status: released
importance: high
type: functional
tags: [library, storage, watchlist, watched, sort, filter, search]
---

## Intent

Provide users with a centralized way to manage saved movies and TV shows, including categorization into "Watchlist" and "Watched" statuses plus sorting and filtering capabilities for larger libraries.

## Context & Background

### Problem Statement

Users need a way to track what they want to watch and what they have already seen. As the library grows, simple status toggles are insufficient; users need tools to narrow entries by genre, rating, or media type, and order them meaningfully.

### User Stories

- As a user, I want to toggle between my Watchlist and Watched entries so I can quickly see what's next and what I've finished.
- As a user, I want to sort my library by date added, title, or release year to find content easily.
- As a user, I want to filter my library by genre, media type, or my own rating range.
- As a user, I want to see an empty state when my filters are too restrictive so I know why no results are appearing.
- As a user with a large library, I want to search by title so that I can quickly find a specific movie or show.
- As a user who uses tags extensively, I want to search by tag name so that I can find all entries with a particular tag.
- As a user who writes notes, I want to search within my notes so that I can find entries based on what I wrote about them.

### Dependencies

- `R-02`: Home screen (provides initial entry points, search, and detail screens).
- `02-home`: Home screen (provides shared `FilterBar` presentation patterns).

## Decisions

| Decision                 | Choice                                                  | Rationale                                                                                                                                              |
| :----------------------- | :------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Persistence              | `localStorage`                                          | Matches the project's "local-first" approach; no backend required.                                                                                     |
| Metadata Redundancy      | Persisted `LibraryEntry` metadata snapshot              | Stores `title`, `posterPath`, `releaseDate`, `voteAverage`, and `genreIds` locally to allow instantaneous sorting/filtering without TMDB API hits.     |
| Component Reuse          | Shared `FilterBar` shell                                | Reuse the Home filter UI patterns while keeping Library filter state local.                                                                            |
| Sorting Logic            | Client-side domain comparators                          | The library dataset is local and bounded; pure comparators/predicates run locally.                                                                     |
| Filter Composition       | AND logic within the active library scope               | Filters refine the currently selected tab; they do not replace the base scope.                                                                         |
| Sort Persistence         | Canonical `Settings` storage                            | Persist `librarySortField` and `librarySortOrder` in a grouped `settings` object.                                                                      |
| Search Data Source       | Search local, validated `LibraryEntry` data only        | Titles, tags, and notes already live in localStorage and must not require TMDB or server-side search.                                                  |
| Searchable Fields        | Search validated `LibraryEntry` data before projection  | `tags` and `notes` exist on `LibraryEntry`; searching before `LibraryViewItem` projection avoids widening the view item only for search.               |
| Query Normalization      | Parse with a domain Zod schema, then trim and lowercase | This satisfies boundary validation and user-input sanitization rules while keeping matching predictable and literal.                                   |
| Search URL/Storage State | Keep search query in volatile screen state only         | R-05 keeps persistent filters out of scope except sort preference, and this feature excludes URL query sync.                                           |
| Search Component         | Use `SearchBar` shared presentation-only input          | The Home `SearchBar` is presentation-only; Library search uses a shared component with Library-specific i18n without coupling to Home screen workflow. |

## Scope

**In Scope:**

- `TabToggle`, `EntryGrid`, `FilterBar`, and `SortDropdown` components.
- `LibraryScreen` integration with sticky filtering and sorting.
- `Settings` domain schema and validation.
- `storage.service.ts` extensions for settings and metadata snapshots.
- `useLibraryEntries`, `useSort`, and `useLibraryFilters` composables.
- Filtered-result empty states.
- Support for genre, media type, and rating range filtering.
- Search input field in the Library screen's sticky controls area.
- User-visible search results are scoped to the selected Watchlist or Watched tab; `LibraryEntry` records with `status: "none"` are not surfaced by Library search because the Library screen has no tab for them.
- Filtering after the user stops typing for 300ms.
- Case-insensitive matching across title, tags, and notes.
- Debounced input to optimize performance.
- Clear/reset search functionality.
- Empty state when no entries match the search query and/or active filters.
- Integration with existing filters (search results are further filtered by active genre/media type/rating filters).
- Responsive design (search bar adapts to mobile layout).

**Out of Scope:**

- Cloud sync or multi-device support.
- Server-side sorting or filtering.
- Persistent filter states (except for sort preference).
- Fuzzy matching or typo tolerance.
- Search history or recent searches.
- Highlighted/bold matching terms in results.
- Search suggestions or autocomplete.
- Saved searches.
- URL query parameter sync for search state.
- Result count display.

## Functional Requirements

### Core Management

| ID   | Requirement   | Description                                                                              | Priority |
| :--- | :------------ | :--------------------------------------------------------------------------------------- | :------- |
| L-01 | Watchlist Tab | Display all library entries with `status: 'watchlist'` in a responsive grid.             | P0       |
| L-02 | Watched Tab   | Display all library entries with `status: 'watched'` in a responsive grid.               | P0       |
| L-08 | Empty States  | Tabs show contextual empty states when no entries are present with a CTA to add content. | P1       |

### Sorting

| ID    | Requirement          | Description                                                                                           | Priority |
| :---- | :------------------- | :---------------------------------------------------------------------------------------------------- | :------- |
| LS-01 | Sort by Date Added   | Users can sort library entries by the date they were added (Newest/Oldest First).                     | P0       |
| LS-02 | Sort by Title        | Users can sort alphabetically using normalized snapshot titles (A-Z, Z-A).                            | P0       |
| LS-03 | Sort by Release Year | Users can sort by release year derived from metadata snapshots.                                       | P1       |
| LS-04 | Sort by User Rating  | Users can sort library entries by the rating they assigned.                                           | P1       |
| LS-06 | Persistence          | Sort selection SHALL be persisted in `Settings`. Falls back to "Date Added (Newest First)" if absent. | P1       |

### Filtering

| ID    | Requirement            | Description                                                                       | Priority |
| :---- | :--------------------- | :-------------------------------------------------------------------------------- | :------- |
| LF-01 | Filter by Genre        | Users can filter the active scope by one or more genres using persisted metadata. | P0       |
| LF-02 | Filter by Media Type   | Users can filter the active scope by media type (Movie, TV Show, or All).         | P0       |
| LF-03 | Filter by Rating Range | Users can filter by a range of user ratings (0.0 to 5.0) with immediate updates.  | P1       |
| LF-07 | Clear Filters          | A "Clear All" action resets all visible filters while preserving the active tab.  | P0       |

### Search

| ID     | Requirement          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Priority |
| ------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| LBS-01 | Search input         | A text input field is displayed in the Library screen's sticky controls area: full-width above filters below `md`, and inline with filters at `md` and above. The input uses i18n key `library.search_placeholder` for its placeholder text (e.g., "Search titles, tags, notes...").                                                                                                                                                                             | P0       |
| LBS-02 | Debounced filtering  | After the user stops typing for 300ms, library entries are filtered to show only entries matching the normalized search query. Matching is performed by pure domain logic (e.g., `matchesLibrarySearchQuery` in `src/domain/filter.logic.ts`) against validated `LibraryEntry.title`, `LibraryEntry.tags`, and `LibraryEntry.notes`; `useLibraryEntries` applies search before projecting entries to `LibraryViewItem` for existing filter and sort composition. | P0       |
| LBS-03 | Case-insensitive     | Search matching is case-insensitive. Searching "batman" matches "Batman", "BATMAN", and "The Batman".                                                                                                                                                                                                                                                                                                                                                            | P0       |
| LBS-04 | Partial matching     | Search matches partial strings. Searching "bat" matches "Batman", "Combat", and any entry with "bat" in title, tags, or notes.                                                                                                                                                                                                                                                                                                                                   | P0       |
| LBS-05 | Query normalization  | Search queries are parsed through a domain-level Zod schema (for example, `LibrarySearchQuerySchema`) before matching, then trimmed, truncated to a maximum of 120 characters after trimming, and lowercased with `toLowerCase()`. Whitespace-only queries are treated as empty, internal whitespace is preserved and matched literally, special characters are matched as literal text, and matching must not interpret the query as a raw regular expression.  | P0       |
| LBS-06 | Clear search         | A clear button (X icon) appears when the search input has text. Clicking it clears the search query immediately, returns focus to the input, and shows all entries (subject to other active filters).                                                                                                                                                                                                                                                            | P0       |
| LBS-07 | Filter integration   | Search results are combined with existing filters. If a user searches "action" while the genre filter is set to "Comedy", only Comedy entries containing "action" in title/tags/notes are shown.                                                                                                                                                                                                                                                                 | P0       |
| LBS-08 | Empty search results | When a non-empty Watchlist or Watched tab scope is reduced to zero entries by the search query and/or active filters, a search/filter empty state extends R-05's filtered empty-state behavior with localized heading "No matches found", supporting text "Try a different search term or clear your filters", and a contextual CTA. Base empty Watchlist/Watched states remain unchanged when the selected tab has no entries before search/filtering.          | P0       |
| LBS-09 | Tab-state retention  | The search query remains in volatile Library screen state while switching between Watchlist and Watched tabs. It is not persisted to localStorage, synced to URL query parameters, or retained across page reloads.                                                                                                                                                                                                                                              | P1       |
| LBS-10 | Keyboard support     | Pressing Enter in the search input does not submit a form or trigger navigation. Pressing Escape clears the search input immediately and shows all entries subject to other active filters.                                                                                                                                                                                                                                                                      | P1       |

### UI/UX Specs

| ID    | Requirement           | Description                                                                                                        | Priority |
| :---- | :-------------------- | :----------------------------------------------------------------------------------------------------------------- | :------- |
| LU-02 | FilterBar Integration | The `FilterBar` SHALL be sticky below the header/tabs.                                                             | P0       |
| LU-04 | Filtered Empty State  | Shows "No items match your filters" with a Clear All action when filters reduce a non-empty scope to zero results. | P0       |

## Non-Functional Requirements

### Performance

| ID    | Requirement     | Description                                                                                                                                                 |
| :---- | :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LN-01 | Filtering Speed | Applying filters to 500 entries SHALL complete in < 50ms.                                                                                                   |
| LN-02 | Sorting Speed   | Sorting 500 entries SHALL complete in < 50ms.                                                                                                               |
| LN-03 | Search Speed    | Search filtering completes in < 50ms for libraries up to 500 entries. The measured duration applies to pure search/filter computation after debounce fires. |
| LN-04 | Debounce Delay  | Debounce delay of 300ms balances responsiveness with performance.                                                                                           |

### UI/UX Consistency

- **Visual Parity**: Uses the same Tailwind theme tokens and layout patterns as the Home screen.
- **Responsive Layout**: Maintains 44x44px touch targets across all breakpoints.

### Responsive Design

- On desktop (`md` and above): Search input is displayed inline with filter controls.
- On mobile (below `md`): Search input spans full width, stacked above filter controls.
- Touch target for clear button is at least 44×44px.

### Accessibility

- Search input has an associated label (visible or `aria-label`).
- Clear button has accessible name (e.g., `aria-label="Clear search"`).
- Focus remains in search input after clearing.

### Internationalization

- All new `library.search.*` and search/filter empty-state i18n keys exist in `en.json`, `es.json`, and `fr.json`, with `en.json` as the canonical source.
- Locale-key validation passes after the new keys are added, and rendered tests cover at least one non-default locale for Library search text.

## Acceptance Criteria

### Core Management

- [ ] `TabToggle` correctly filters the library by status.
- [ ] `SortDropdown` and `FilterBar` correctly refine the active library scope.
- [ ] Sort selection is persisted across page reloads.
- [ ] Empty states correctly distinguish between empty scopes and restrictive filters.
- [ ] Metadata snapshots (genre, rating, etc.) allow fully local, instantaneous operations.

### Search

- [ ] **LBS-01**: A search input is visible in the Library screen's sticky controls area, above the entry grid.
- [ ] **LBS-01**: Search input is responsive: full-width above filters on mobile and inline with filters on desktop.
- [ ] **LBS-01**: Search input placeholder indicates the searchable fields, uses i18n, and the input does not steal focus on page load.
- [ ] **LBS-02, LBS-03, LBS-04**: Typing "batman" and waiting 300ms filters to entries with "batman" in title, tags, or notes regardless of case.
- [ ] **LBS-02**: Search matching runs before projection and uses data that includes `LibraryEntry.title`, `LibraryEntry.tags`, and `LibraryEntry.notes`.
- [ ] **LBS-04**: Searching "bat" matches entries with "bat" anywhere in title, tags, or notes, including examples like "Batman" and "Combat".
- [ ] **LBS-05**: Searching " bat " behaves the same as searching "bat".
- [ ] **LBS-05**: The search query is parsed through a domain-level Zod schema before matching.
- [ ] **LBS-05**: Search queries longer than 120 characters after trimming are truncated to 120 characters before lowercasing and matching.
- [ ] **LBS-05**: A whitespace-only query is treated as empty and shows all entries subject to other active filters.
- [ ] **LBS-05**: Special characters in the query are matched as literal text and do not behave as regular expressions.
- [ ] **LBS-05**: Internal whitespace in the query is preserved and matched literally.
- [ ] **LBS-06**: Clearing the search input immediately shows all entries subject to other active filters and returns focus to the search input.
- [ ] **LBS-07**: Searching "action" with genre filter set to "Comedy" shows only Comedy entries containing "action".
- [ ] **LBS-07**: Searching with an active user rating filter shows only entries that match both the search query and the selected rating range.
- [ ] **LBS-02, LBS-08**: Entries with `status: "none"` are never surfaced by Library search and do not count as Watchlist/Watched base-scope entries.
- [ ] **LBS-08**: The search/filter empty state appears only when a non-empty Watchlist or Watched tab scope is reduced to zero entries by search and/or filters.
- [ ] **LBS-08**: The search/filter empty-state CTA clears search, filters, or both based on the active empty-result causes.
- [ ] **LBS-09**: Search query remains applied when switching between Watchlist and Watched tabs, but is not retained after page reload.
- [ ] **LBS-10**: Pressing Escape in the search input clears the query immediately.
- [ ] **LBS-10**: If the user types a query, clears or presses Escape before 300ms, and timers advance, the old query is not reapplied.
- [ ] **LBS-10**: Pressing Enter in the search input does not submit a form or navigate.
- [ ] **Performance NFR**: Pure search/filter computation and composable recomputation complete in < 50ms for a library of 500 entries after the debounce fires, excluding DOM rendering.
- [ ] **Responsive NFR**: Clear button has a touch target of at least 44×44px on mobile.
- [ ] **Accessibility NFR**: Search input has a visible label or `aria-label`, clear button has an accessible name, and focus remains in the input after clearing.
- [ ] **i18n**: All user-facing text uses mirrored `en`, `es`, and `fr` i18n keys, and locale-key validation or rendered locale tests cover the new keys.
