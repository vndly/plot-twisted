# Implementation: Release Calendar Sync

## Overview

Implemented a monthly release calendar for upcoming movies using the TMDB `/movie/upcoming` endpoint. The implementation includes a responsive 7-column grid for desktop/tablet and a list-view fallback for mobile devices. It features multi-page API fetching to ensure a complete month's data is visible and supports region-specific release dates based on user settings.

## Files Changed

### Created

- `src/domain/calendar.logic.ts` — Pure logic for month day calculation, grid padding, and movie grouping.
- `src/application/use-upcoming-movies.ts` — Composable for fetching and managing upcoming movies with multi-page support.
- `src/application/use-calendar.ts` — Composable for managing calendar state (month/year) via URL query parameters.
- `src/presentation/components/calendar/release-card.vue` — Compact movie card optimized for dense grid display.
- `src/presentation/components/calendar/calendar-grid.vue` — Monthly calendar grid with responsive layouts and loading/empty states.
- `tests/infrastructure/provider.client.calendar.test.ts` — Tests for the new API client method.
- `tests/domain/calendar.logic.test.ts` — Tests for calendar pure functions.
- `tests/application/use-upcoming-movies.test.ts` — Tests for the upcoming movies composable.
- `tests/application/use-calendar.test.ts` — Tests for the calendar state composable.

### Modified

- `src/domain/shared.schema.ts` — Added `PaginatedResponse` type and `createPaginatedResponseSchema` factory.
- `src/infrastructure/provider.client.ts` — Added `getUpcomingMovies` method.
- `src/presentation/views/calendar-screen.vue` — Integrated calendar grid and navigation headers.
- `src/presentation/i18n/locales/en.json` — Added calendar-related internationalization keys.

## Key Decisions

- **Multi-page Fetching**: Deviated from the general "page 1 only" rule for list endpoints to ensure a full month's releases are visible in the calendar.
- **URL-based State**: Used URL query parameters for month/year to enable persistence across reloads and deep linking.
- **Local Time Handling**: Dates are processed in local time for display while ensuring consistency in grouping.

## Deviations from Plan

- None — Implementation followed the plan exactly, including all infrastructure, domain, application, and presentation steps.

## Testing

- **Infrastructure**: Verified correct URL construction and Zod validation for `getUpcomingMovies`.
- **Domain**: Verified leap year handling and grid padding logic in `calendar.logic.ts`.
- **Application**: Verified multi-page fetching and route-based state persistence.
- **Verification Results**:
  - `npm run test` — PASS (17/17 new tests)
  - `npm run type-check` — PASS
  - `npm run format` — PASS

## Dependencies

- No new external dependencies added.
