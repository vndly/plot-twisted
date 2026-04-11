# Plan - Recommendations

Implementation of personalized recommendations based on library seeds as a dedicated page.

## Phase 1: Domain & Infrastructure

Implement the core logic for seed selection, deduplication, and API integration.

- [ ] **Step 1.1: Add Recommendations to API Client**: Extend `provider.client.ts` to include `getMovieRecommendations(id, language)` and `getShowRecommendations(id, language)` methods. (RE-02)
  - **File**: `src/infrastructure/provider.client.ts`
  - **Details**: Add/update Zod schemas for TMDB recommendation responses. Use `/movie/{id}/recommendations` and `/tv/{id}/recommendations`. Ensure `language` parameter is passed. (Rollback: Additive, non-destructive).
- [ ] **Step 1.2: Unit Tests for Seed Selection**: Create `tests/domain/recommendations.logic.test.ts` and write tests for the seed selection logic. (RE-01)
  - **File**: `tests/domain/recommendations.logic.test.ts`
  - **Covering**: RE-01-01, RE-01-02, RE-01-03
- [ ] **Step 1.3: Implement Seed Selection Logic**: Create a domain function to select up to 5 seed entries from the library based on ratings and recency. (RE-01)
  - **File**: `src/domain/recommendations.logic.ts`
  - **Details**: Priority: Rating (5-1) > Last Activity (latest of `addedAt` and `watchDates`).
- [ ] **Step 1.4: Unit Tests for Deduplication & Exclusion**: Write tests for deduplication and library filtering in `tests/domain/recommendations.logic.test.ts`. (RE-03, RE-04)
  - **File**: `tests/domain/recommendations.logic.test.ts`
  - **Covering**: RE-03-01, RE-04-01
- [ ] **Step 1.5: Implement Deduplication & Exclusion Logic**: Create a domain function to deduplicate results across all seeds/trending sections and filter out library entries. (RE-03, RE-04)
  - **File**: `src/domain/recommendations.logic.ts`

## Phase 2: Application Logic

Create the composable to orchestrate seed selection and recommendation fetching.

- [ ] **Step 2.1: Create useRecommendations Composable**: Implement `useRecommendations` to manage the lifecycle of fetching recommendations for all seeds. (RE-02, RE-08, RE-09, RE-11)
  - **File**: `src/application/use-recommendations.ts`
  - **Details**: Fetches seeds, then provides a reactive interface for fetching recommendations per seed. Supports independent loading/error states and rate-limit handling.

## Phase 3: Presentation

Create the dedicated Recommendations screen and register the route.

- [ ] **Step 3.1: Create useIntersectionObserver Composable**: Create a reusable composable for lazy-loading logic. (RE-10)
  - **File**: `src/presentation/composables/use-intersection-observer.ts`
- [ ] **Step 3.2: Create RecommendationCarousel Component**: Build a new carousel component for recommendation sections that follows the `TrendingCarousel` layout and supports lazy loading. (RE-05, RE-10)
  - **File**: `src/presentation/components/recommendations/RecommendationCarousel.vue`
  - **Details**: Use `useIntersectionObserver` for lazy-loading. Use `vue-i18n` for dynamic labels: "Because you liked {title}" (rating >= 3) or "Because you watched {title}" (rating < 3 or unrated).
- [ ] **Step 3.3: Create Recommendations View**: Create the `recommendations-screen.vue` component. (RE-06, RE-07, RE-08, RE-09, RE-11)
  - **File**: `src/presentation/views/recommendations-screen.vue`
  - **Details**: Display "Recommended for You" heading followed by the carousels for each seed. Render "Trending" and "Popular" fallbacks if no seeds exist.
- [ ] **Step 3.4: Register Recommendations Route**: Update the router to include the `/recommendations` route. (RE-06)
  - **File**: `src/presentation/router.ts`
  - **Details**: Ensure the route uses lazy-loading and has the correct `meta.titleKey`.
- [ ] **Step 3.5: Clean up Scaffolding Docs**: Remove "deferred" notes for the recommendations feature.
  - **Files**: `docs/product/01 - scaffolding/requirements.md`, `docs/roadmap/index.md`

## Phase 4: Testing & Verification

- [ ] **Step 4.1: Testing Phase**: Run all automated tests developed in previous phases.
  - **Command**: `npm run test`
  - **Covering**: RE-01-*, RE-02-*, RE-03-*, RE-04-*, RE-05-*, RE-08-*, RE-09-*, RE-10-*, RE-11-*
- [ ] **Step 4.2: Verification Phase**: Final manual checks and build verification.
  - [ ] **Build Verification**: `npm run build && npm run type-check`
  - [ ] **Nav Verification**: Verify navigation to `/recommendations` via sidebar/bottom nav works. (RE-06-01)
  - [ ] **Title Verification**: Verify document title is correct on the Recommendations screen. (RE-06-02)
  - [ ] **API Verification**: Verify recommendations are fetched in the correct user language and respect pagination (first page only). (RE-02-01, RE-02-02)
  - [ ] **Labels Verification**: Verify "Because you liked {title}" vs "Because you watched {title}" labels are correct. (RE-05-01, RE-05-02, RE-05-03)
  - [ ] **Deduplication Verification**: Verify no duplicates across sections (including trending). (RE-03-01)
  - [ ] **Exclusion Verification**: Verify library entries are excluded. (RE-04-01)
  - [ ] **Fallback Verification**: Verify fallback to Trending/Popular when library is empty. (RE-07-01)
  - [ ] **Error Verification**: Verify independent error handling and rate-limit toasts. (RE-08-01, RE-11-01)
  - [ ] **Lazy Loading Verification**: Verify carousels only fetch data when approaching the viewport. (RE-10-01)
