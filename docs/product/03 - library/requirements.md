---
id: R-05
title: 'Library Management: Collections, Sorting, and Filtering'
status: released
importance: high
type: functional
tags: [library, storage, lists, watchlist, watched, sort, filter]
---

## Intent

Provide users with a centralized way to manage their saved movies and TV shows, including categorization into "Watchlist" and "Watched" statuses, organization into custom lists, and advanced sorting and filtering capabilities to manage large collections.

## Context & Background

### Problem Statement

Users need a way to track what they want to watch and what they have already seen. As the library grows, simple status toggles are insufficient; users need to create custom collections and use tools to narrow down their collections by genre, rating, or media type, and order them meaningfully.

### User Stories

- As a user, I want to toggle between my Watchlist and Watched entries so I can quickly see what's next and what I've finished.
- As a user, I want to create custom lists with meaningful names so I can organize my library by genre, mood, or any other criteria.
- As a user, I want to add or remove movies/shows from my custom lists from their detail screen.
- As a user, I want to see all entries in a specific custom list in a grid view.
- As a user, I want to rename or delete my custom lists when they are no longer needed.
- As a user, I want to sort my library by date added, title, or release year to find content easily.
- As a user, I want to filter my library by genre, media type, or my own rating range.
- As a user, I want to see an empty state when my filters are too restrictive so I know why no results are appearing.

### Dependencies

- `R-02`: Home screen (provides initial entry points, search, and detail screens).
- `02-home`: Home screen (provides shared `FilterBar` presentation patterns).

## Decisions

| Decision            | Choice                                     | Rationale                                                                                                                                          |
| :------------------ | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| Persistence         | `localStorage`                             | Matches the project's "local-first" approach; no backend required.                                                                                 |
| List association    | ID-based array on `LibraryEntry`           | Simple to implement and query; avoids complex join logic in a local-first environment.                                                             |
| List Schema         | Separate `List` entity                     | Allows storing list metadata (name, created date) independently of the entries it contains.                                                        |
| Metadata Redundancy | Persisted `LibraryEntry` metadata snapshot | Stores `title`, `posterPath`, `releaseDate`, `voteAverage`, and `genreIds` locally to allow instantaneous sorting/filtering without TMDB API hits. |
| Component Reuse     | Shared `FilterBar` shell                   | Reuse the Home filter UI patterns while keeping Library filter state local.                                                                        |
| Sorting Logic       | Client-side domain comparators             | The library dataset is local and bounded; pure comparators/predicates run locally.                                                                 |
| Filter Composition  | AND logic within the active library scope  | Filters refine the currently selected tab or custom list; they do not replace the base scope.                                                      |
| Sort Persistence    | Canonical `Settings` storage               | Persist `librarySortField` and `librarySortOrder` in a grouped `settings` object.                                                                  |

## Scope

**In Scope:**

- `TabToggle`, `EntryGrid`, `FilterBar`, `SortDropdown`, and `ListManagerModal` components.
- `LibraryScreen` integration with sticky filtering and sorting.
- `List` and `Settings` domain schemas and validation.
- `storage.service.ts` extensions for lists, settings, and metadata snapshots.
- `useLibraryEntries`, `useLists`, `useSort`, and `useLibraryFilters` composables.
- UI for custom list CRUD and filtered-result empty states.
- Support for genre, media type, rating range, and watch status filtering.

**Out of Scope:**

- Cloud sync or multi-device support.
- Sharing lists with other users.
- Server-side sorting or filtering.
- Persistent filter states (except for sort preference).

## Functional Requirements

### Core Management

| ID   | Requirement             | Description                                                                                        | Priority |
| :--- | :---------------------- | :------------------------------------------------------------------------------------------------- | :------- |
| L-01 | Watchlist Tab           | Display all library entries with `status: 'watchlist'` in a responsive grid.                       | P0       |
| L-02 | Watched Tab             | Display all library entries with `status: 'watched'` in a responsive grid.                         | P0       |
| L-03 | Custom Lists Management | Users can create, rename, and delete custom lists with unique names.                               | P0       |
| L-04 | List-Entry Association  | Users can add/remove entries to/from custom lists from the entry detail screen.                    | P0       |
| L-05 | List View               | Selecting a custom list displays all entries associated with that list ID.                         | P0       |
| L-06 | Deletion Integrity      | Deleting a list removes its ID from entries without deleting the entries themselves.               | P1       |
| L-08 | Empty States            | Tabs and lists show contextual empty states when no entries are present with a CTA to add content. | P1       |

### Sorting

| ID    | Requirement          | Description                                                                                           | Priority |
| :---- | :------------------- | :---------------------------------------------------------------------------------------------------- | :------- |
| LS-01 | Sort by Date Added   | Users can sort library entries by the date they were added (Newest/Oldest First).                     | P0       |
| LS-02 | Sort by Title        | Users can sort alphabetically using normalized snapshot titles (A-Z, Z-A).                            | P0       |
| LS-03 | Sort by Release Year | Users can sort by release year derived from metadata snapshots.                                       | P1       |
| LS-04 | Sort by User Rating  | Users can sort library entries by the rating they assigned.                                           | P1       |
| LS-06 | Persistence          | Sort selection SHALL be persisted in `Settings`. Falls back to "Date Added (Newest First)" if absent. | P1       |

### Filtering

| ID    | Requirement            | Description                                                                                           | Priority |
| :---- | :--------------------- | :---------------------------------------------------------------------------------------------------- | :------- |
| LF-01 | Filter by Genre        | Users can filter the active scope by one or more genres using persisted metadata.                     | P0       |
| LF-02 | Filter by Media Type   | Users can filter the active scope by media type (Movie, TV Show, or All).                             | P0       |
| LF-03 | Filter by Rating Range | Users can filter by a range of user ratings (0.0 to 5.0) with immediate updates.                      | P1       |
| LF-04 | Filter by Watch Status | On the Lists view, users can filter the selected list by watch status. Hidden on status-defined tabs. | P1       |
| LF-05 | Filter by Custom List  | On Watchlist/Watched tabs, users can filter by list membership. Hidden on Lists view.                 | P1       |
| LF-07 | Clear Filters          | A "Clear All" action resets all visible filters while preserving the active tab/list.                 | P0       |

### UI/UX Specs

| ID    | Requirement           | Description                                                                                                        | Priority |
| :---- | :-------------------- | :----------------------------------------------------------------------------------------------------------------- | :------- |
| LU-02 | FilterBar Integration | The `FilterBar` SHALL be sticky below the header/tabs.                                                             | P0       |
| LU-04 | Filtered Empty State  | Shows "No items match your filters" with a Clear All action when filters reduce a non-empty scope to zero results. | P0       |

## Non-Functional Requirements

### Performance

| ID    | Requirement     | Description                                               |
| :---- | :-------------- | :-------------------------------------------------------- |
| LN-01 | Filtering Speed | Applying filters to 500 entries SHALL complete in < 50ms. |
| LN-02 | Sorting Speed   | Sorting 500 entries SHALL complete in < 50ms.             |

### UI/UX Consistency

- **Visual Parity**: Uses the same Tailwind theme tokens and layout patterns as the Home screen.
- **Responsive Layout**: Maintains 44x44px touch targets across all breakpoints.

## Acceptance Criteria

- [ ] `TabToggle` correctly filters the library by status.
- [ ] Users can manage custom lists (CRUD) with persistence.
- [ ] `SortDropdown` and `FilterBar` correctly refine the active library scope.
- [ ] Sort selection is persisted across page reloads.
- [ ] Empty states correctly distinguish between empty scopes and restrictive filters.
- [ ] Metadata snapshots (genre, rating, etc.) allow fully local, instantaneous operations.
