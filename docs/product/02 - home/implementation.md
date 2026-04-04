# Implementation: Home Screen

## Overview

This implementation adds search functionality and entry detail views to the home screen, enabling users to search for movies and TV shows using TMDB's multi-search API and view comprehensive details about each title. The implementation follows a test-first approach across all architectural layers (Domain → Infrastructure → Application → Presentation).

**Search functionality**: 300ms debounced input, client-side filtering of person results, and seamless mode switching between browse and search states. A SearchBar component at the top of the home screen transitions the app between search mode (displaying results in a responsive grid) and browse mode (stubbed for future implementation).

**Entry Details functionality**: Comprehensive movie and TV show detail views including metadata, cast, trailer, streaming availability, and personal tracking features (rating, favorite, watch status) persisted in localStorage.

## Files Changed

### Created

**Domain Layer:**

- `src/domain/movie.schema.ts` — Zod schemas for MovieListItem and MovieDetailSchema (with credits, videos, watch/providers, release_dates)
- `src/domain/show.schema.ts` — Zod schemas for ShowListItem and ShowDetailSchema (with TV-specific fields)
- `src/domain/search.schema.ts` — Zod schemas for SearchResultItem (discriminated union by media_type) and SearchResponse (paginated wrapper)
- `src/domain/library.schema.ts` — LibraryEntry schema with rating (0-5), favorite, status (watchlist/watched/none)
- `src/domain/shared.schema.ts` — Shared Zod schemas for Genre, CastMember, CrewMember, Video, StreamingProvider, WatchProviderRegion, SpokenLanguage

**Infrastructure Layer:**

- `src/infrastructure/provider.client.ts` — TMDB API client with `searchMulti()`, `getMovieDetail()`, and `getShowDetail()` methods, Bearer token auth, and exponential backoff retry for 429 responses
- `src/infrastructure/image.helper.ts` — `buildImageUrl()` helper for constructing full image URLs from TMDB relative paths
- `src/infrastructure/storage.service.ts` — localStorage service for library entries with getLibraryEntry, saveLibraryEntry, getAllLibraryEntries, removeLibraryEntry

**Application Layer:**

- `src/application/use-settings.ts` — Stub composable returning `language: ref('en')` and `preferredRegion: ref('US')` for API localization and streaming provider filtering
- `src/application/use-search.ts` — Search composable with debounced query watching, loading/error state, results filtering, and mode detection
- `src/application/use-movie-detail.ts` — Composable returning { data, loading, error, refresh } for movie details
- `src/application/use-show-detail.ts` — Composable returning { data, loading, error, refresh } for TV show details
- `src/application/use-library-entry.ts` — Composable with setRating, toggleFavorite, setStatus methods for library management

**Presentation Layer:**

- `src/presentation/components/home/search-bar.vue` — Search input with clear button, v-model binding, and accessibility attributes
- `src/presentation/components/home/search-results.vue` — Results display with loading skeleton, error state, empty state, and MovieCard grid
- `src/presentation/components/common/movie-card.vue` — Card component displaying poster, title, year, and vote average for movies/shows
- `src/presentation/components/common/movie-card-skeleton.vue` — Loading placeholder matching MovieCard's 2:3 aspect ratio
- `src/presentation/components/details/hero-backdrop.vue` — Full-width backdrop image with gradient overlay and title/tagline
- `src/presentation/components/details/metadata-panel.vue` — Year, runtime, genres, directors, writers, spoken languages
- `src/presentation/components/details/cast-carousel.vue` — Horizontally scrollable cast list with profile images
- `src/presentation/components/details/trailer-embed.vue` — YouTube trailer with click-to-play using privacy-enhanced mode
- `src/presentation/components/details/streaming-badges.vue` — Provider logos for streaming availability by region
- `src/presentation/components/details/box-office.vue` — Budget and revenue display for movies
- `src/presentation/components/details/provider-rating-badge.vue` — TMDB rating badge with star icon
- `src/presentation/components/details/synopsis.vue` — Full overview text display
- `src/presentation/components/details/rating-stars.vue` — Interactive 5-star rating with keyboard navigation
- `src/presentation/components/details/action-buttons.vue` — Favorite, watchlist, watched, share, IMDB buttons
- `src/presentation/components/details/detail-skeleton.vue` — Loading skeleton matching detail layout

**Presentation Layer - Views:**

- `src/presentation/views/movie-screen.vue` — Full movie detail view composing all detail components
- `src/presentation/views/show-screen.vue` — Full TV show detail view (no BoxOffice, no IMDB link)

**Test Files:**

- `tests/domain/search.schema.test.ts` — Schema parsing tests for movie, TV, and person results
- `tests/domain/movie-detail.schema.test.ts` — MovieDetailSchema validation tests
- `tests/domain/show-detail.schema.test.ts` — ShowDetailSchema validation tests
- `tests/domain/library-entry.schema.test.ts` — LibraryEntrySchema validation tests
- `tests/infrastructure/provider.client.search.test.ts` — API client tests for URL construction, error handling, and retry logic
- `tests/infrastructure/provider.client.movie-detail.test.ts` — getMovieDetail API tests
- `tests/infrastructure/provider.client.show-detail.test.ts` — getShowDetail API tests
- `tests/infrastructure/storage.service.test.ts` — Storage service tests
- `tests/application/use-search.test.ts` — Composable tests for debounce, filtering, loading states, error handling, and mode transitions
- `tests/application/use-movie-detail.test.ts` — Movie detail composable tests
- `tests/application/use-show-detail.test.ts` — Show detail composable tests
- `tests/application/use-library-entry.test.ts` — Library entry composable tests
- `tests/presentation/components/home/search-bar.test.ts` — Component tests for v-model binding and clear functionality
- `tests/presentation/components/home/search-results.test.ts` — Component tests for all display states and navigation
- `tests/presentation/components/common/movie-card-skeleton.test.ts` — Skeleton component tests
- `tests/presentation/components/details/hero-backdrop.test.ts` — HeroBackdrop component tests
- `tests/presentation/components/details/metadata-panel.test.ts` — MetadataPanel component tests
- `tests/presentation/components/details/cast-carousel.test.ts` — CastCarousel component tests
- `tests/presentation/components/details/trailer-embed.test.ts` — TrailerEmbed component tests
- `tests/presentation/components/details/streaming-badges.test.ts` — StreamingBadges component tests
- `tests/presentation/components/details/box-office.test.ts` — BoxOffice component tests
- `tests/presentation/components/details/provider-rating-badge.test.ts` — ProviderRatingBadge component tests
- `tests/presentation/components/details/synopsis.test.ts` — Synopsis component tests
- `tests/presentation/components/details/rating-stars.test.ts` — RatingStars component tests
- `tests/presentation/components/details/action-buttons.test.ts` — ActionButtons component tests
- `tests/presentation/components/details/detail-skeleton.test.ts` — DetailSkeleton component tests
- `tests/presentation/views/movie-screen.test.ts` — MovieScreen view tests
- `tests/presentation/views/show-screen.test.ts` — ShowScreen view tests

### Modified

- `src/domain/constants.ts` — Added `SEARCH_DEBOUNCE_MS`, `MIN_SEARCH_QUERY_LENGTH`, `MAX_RETRY_ATTEMPTS`, `RETRY_BASE_DELAY_MS`, `IMAGE_BASE_URL`, `IMAGE_SIZES`
- `src/domain/movie.schema.ts` — Added MovieDetailSchema with credits, videos, watch/providers, release_dates
- `src/domain/show.schema.ts` — Added ShowDetailSchema with TV-specific fields
- `src/infrastructure/provider.client.ts` — Added getMovieDetail and getShowDetail methods using append_to_response
- `src/application/use-settings.ts` — Added preferredRegion ref (defaults to 'US')
- `src/presentation/components/common/empty-state.vue` — Added slot for custom button content
- `src/presentation/views/home-screen.vue` — Replaced EmptyState placeholder with SearchBar and conditional SearchResults/browse sections
- `src/presentation/i18n/locales/en.json` — Added 33 new keys for search and detail UI text
- `src/presentation/i18n/locales/es.json` — Added Spanish translations
- `src/presentation/i18n/locales/fr.json` — Added French translations
- `tests/presentation/views/home-screen.test.ts` — Updated tests for search mode behavior
- `tests/presentation/i18n/locale-keys.test.ts` — Updated expected key count
- `tests/App.test.ts` — Added lucide-vue-next icon mocks and updated home content assertion

## Key Decisions

- **Discriminated union for search results**: Used Zod's `z.discriminatedUnion` with `media_type` as the discriminator. This allows type-safe handling of movie, TV, and person results while enabling compile-time filtering.

- **Client-side person filtering**: Filter `media_type === 'person'` results in the `useSearch` composable rather than calling separate movie/TV endpoints. This keeps API usage minimal and aligns with the single-endpoint design decision in requirements.

- **Debounce in composable, not component**: The 300ms debounce is implemented in `useSearch` using `watch()` with `setTimeout`/`clearTimeout`. This centralizes the timing logic and makes it testable without component rendering.

- **Stub browse mode**: Browse sections (TrendingCarousel, PopularGrid, FilterBar, ViewToggle) are planned for a future feature. The current implementation shows an empty `<div data-testid="browse-sections">` as a placeholder.

- **MovieCard component for both types**: A single `MovieCard` component handles both movies and TV shows, using computed properties to normalize `title`/`name` and `release_date`/`first_air_date`.

- **Single API call with append_to_response**: Movie and show details use TMDB's `append_to_response` parameter to fetch credits, videos, watch/providers, and release_dates in a single request, minimizing latency.

- **Privacy-enhanced YouTube embeds**: Trailers use `youtube-nocookie.com` domain instead of `youtube.com` to reduce tracking, and only load the iframe after user interaction.

- **localStorage for library data**: User ratings, favorites, and watch status are stored locally using `LibraryEntry` schema, consistent with the app's local-first architecture.

- **Streaming region default**: Uses 'US' as default region for streaming providers until Settings feature (roadmap 11) is implemented.

## Deviations from Plan

- **useSettings stub**: Created a minimal stub implementation instead of a full settings composable with localStorage persistence. This satisfies the immediate need for `language` and `preferredRegion` without introducing scope creep. The stub returns hardcoded refs which can be replaced when the Settings feature is implemented.

- **Phase 0 order**: Created the provider client base structure before search schema exists. The `searchMulti` method was added in Phase 2 after the schema was available for Zod validation.

- **storage.service.ts created as part of Entry Details**: The storage service was created during the Entry Details implementation phase rather than as a standalone prerequisite, as it is specifically tailored for library entry persistence.

## Testing

**Test files: 420 tests total across 50 test files**

**Domain tests:**

- `tests/domain/search.schema.test.ts` — Schema parsing tests for movie, TV, and person results
- `tests/domain/movie-detail.schema.test.ts` — MovieDetailSchema validation tests
- `tests/domain/show-detail.schema.test.ts` — ShowDetailSchema validation tests
- `tests/domain/library-entry.schema.test.ts` — LibraryEntrySchema validation tests

**Infrastructure tests:**

- `tests/infrastructure/provider.client.search.test.ts` — API client tests for URL construction, error handling, and retry logic
- `tests/infrastructure/provider.client.movie-detail.test.ts` — getMovieDetail API tests
- `tests/infrastructure/provider.client.show-detail.test.ts` — getShowDetail API tests
- `tests/infrastructure/storage.service.test.ts` — Storage service tests

**Application tests:**

- `tests/application/use-search.test.ts` — Composable tests for debounce, filtering, loading states, error handling, and mode transitions
- `tests/application/use-movie-detail.test.ts` — Movie detail composable tests
- `tests/application/use-show-detail.test.ts` — Show detail composable tests
- `tests/application/use-library-entry.test.ts` — Library entry composable tests

**Presentation tests:**

- `tests/presentation/components/home/search-bar.test.ts` — Component tests for v-model binding and clear functionality
- `tests/presentation/components/home/search-results.test.ts` — Component tests for all display states and navigation
- `tests/presentation/components/common/movie-card-skeleton.test.ts` — Skeleton component tests
- `tests/presentation/components/details/*.test.ts` — Tests for all detail components (HeroBackdrop, MetadataPanel, CastCarousel, TrailerEmbed, StreamingBadges, BoxOffice, ProviderRatingBadge, Synopsis, RatingStars, ActionButtons, DetailSkeleton)
- `tests/presentation/views/movie-screen.test.ts` — MovieScreen view tests
- `tests/presentation/views/show-screen.test.ts` — ShowScreen view tests

**Coverage:**

- Schema parsing: valid/invalid inputs for all media types, detail schemas, library entries
- API client: URL construction, parameter encoding, empty query rejection, error handling, exponential backoff, append_to_response
- Composable: debounce behavior, result filtering, loading/error states, mode transitions, retry functionality, library persistence
- Components: v-model binding, conditional rendering, navigation, accessibility attributes, keyboard navigation

## Dependencies

No new dependencies. The implementation uses existing project dependencies:

- `zod` for schema validation
- `vue` for reactivity and components
- `vue-router` for navigation
- `vue-i18n` for translations
- `lucide-vue-next` for icons

## Security Considerations

**Input validation**: Search queries are trimmed before use in API calls. The `searchMulti` function in `provider.client.ts` rejects empty/whitespace-only queries before making requests.

**XSS prevention**: All user input is rendered through Vue's template escaping. No `v-html` usage. Query strings are passed to URLSearchParams which handles encoding.

**API token**: The TMDB read access token is embedded in the client bundle (existing behavior). This is documented as acceptable per `docs/technical/security.md`.

## Error UX

- **Network/server errors**: Display inline error message "Failed to load search results" with a Retry button. The error is not full-page; the SearchBar remains interactive.
- **Rate limiting (429)**: Automatic retry with exponential backoff (1s, 2s, 4s). After 3 retries, falls through to error state with Retry button.
- **Empty results**: Display centered empty state with heading "No results found" and subtitle "Try different keywords or check your spelling".

## Internationalization

All user-facing strings use vue-i18n's `$t()` or `useI18n()`:

**Search keys:**

- `home.search.placeholder` — SearchBar placeholder text
- `home.search.clear` — Clear button aria-label
- `home.search.empty.title` — Empty state heading
- `home.search.empty.subtitle` — Empty state subtitle
- `home.search.error.message` — Error state message
- `home.search.error.retry` — Retry button label

**Detail keys:**

- `details.loading` — Loading state text
- `details.error.title` — Error state heading
- `details.error.retry` — Retry button label
- `details.notFound.title` — 404 heading
- `details.notFound.message` — 404 description
- `details.notFound.home` — Back to home link
- `details.streaming.notAvailable` — No streaming providers message
- `details.actions.*` — Action button labels (favorite, watchlist, watched, share, imdb)
- `details.share.copied` — Clipboard copy toast
- `details.metadata.*` — Metadata labels (director, writers, seasons, episodes)
- `details.cast.title` — Cast section heading
- `details.trailer.*` — Trailer labels
- `details.boxOffice.*` — Box office labels

Translations provided for English, Spanish, and French.

## Performance Considerations

- **Debounce**: 300ms debounce prevents excessive API calls during typing
- **First page only**: Per project pagination strategy, only 20 results are fetched
- **Lazy loading**: Poster images use `loading="lazy"` attribute
- **No caching**: Per project conventions, no response caching is implemented

## Known Limitations

- **Browse mode placeholder**: TrendingCarousel, PopularGrid, FilterBar, and ViewToggle components are stubbed. They will be implemented as part of a separate home-browse feature.
- **Settings stub**: `useSettings` returns hardcoded language and preferredRegion values. Full settings persistence will come with the Settings feature.
- **No search history**: Out of scope per requirements.
- **No infinite scroll**: First page only per project pagination strategy.
- **Single page results**: Maximum 20 results displayed.
- **No season/episode browser**: TV show details don't include episode-level navigation (future feature).
- **Streaming region**: Users must wait for Settings feature to change their region; defaults to 'US'.

## Rollback Strategy

**To roll back search feature:**

1. Revert `src/presentation/views/home-screen.vue` to the EmptyState placeholder version
2. Remove the search-related created files in domain, infrastructure, application, and presentation layers
3. Revert the i18n files to remove the `home.search.*` keys
4. Revert `tests/presentation/i18n/locale-keys.test.ts` expected key count
5. Revert `tests/App.test.ts` icon mocks and assertions

**To roll back entry details feature:**

1. Remove detail-related created files in domain, infrastructure, application, and presentation layers
2. Revert movie-screen.vue and show-screen.vue to stub versions
3. Revert the i18n files to remove the `details.*` keys
4. Remove storage.service.ts (will clear user library data from localStorage)

**Note:** Rolling back entry details will affect any library data stored in localStorage. Consider backing up `plot-twisted-library` key before rollback.
