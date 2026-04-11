# Plan - Recommendations

Implementation of personalized recommendations based on library seeds.

## Phase 1: Domain & Infrastructure

Implement the core logic for seed selection, deduplication, and API integration.

- [ ] **Step 1.1: Add Recommendations to API Client**: Extend `provider.client.ts` to include `getMovieRecommendations(id)` and `getShowRecommendations(id)` methods. Derive from existing detail methods.
  - **File**: `src/infrastructure/provider.client.ts`
  - **Details**: Use `/movie/{id}/recommendations` and `/tv/{id}/recommendations`.
- [ ] **Step 1.2: Unit Tests for Seed Selection**: Write tests for the seed selection logic with various library states.
  - **File**: `tests/domain/recommendations.logic.test.ts`
  - **Covering**: SC-05-01, SC-05-02
- [ ] **Step 1.3: Implement Seed Selection Logic**: Create a domain function to select up to 5 seed entries from the library based on ratings and recency.
  - **File**: `src/domain/recommendations.logic.ts`
  - **Details**: Priority: Rating (5-1) > Last Added/Watched date.
- [ ] **Step 1.4: Unit Tests for Deduplication**: Write tests for deduplication and library filtering.
  - **File**: `tests/domain/recommendations.logic.test.ts`
  - **Covering**: SC-05-03
- [ ] **Step 1.5: Implement Deduplication Logic**: Create a domain function to deduplicate results across multiple seeds and filter out library entries.
  - **File**: `src/domain/recommendations.logic.ts`

## Phase 2: Application Logic

Create the composable to orchestrate seed selection and recommendation fetching.

- [ ] **Step 2.1: Create useRecommendations Composable**: Implement `useRecommendations` to manage the lifecycle of fetching recommendations for all seeds.
  - **File**: `src/application/use-recommendations.ts`
  - **Details**: Fetches seeds, then calls API in parallel for each. Manages loading/error states for the whole set or individual sections.

## Phase 3: Presentation

Integrate recommendations into the Home screen.

- [ ] **Step 3.1: Create RecommendationCarousel Component**: Build a reusable carousel for recommendation sections, potentially refactoring `TrendingCarousel`.
  - **File**: `src/presentation/components/home/RecommendationCarousel.vue`
  - **Details**: Use `vue-i18n` for dynamic labels like "Because you liked {title}".
- [ ] **Step 3.2: Update Home View**: Integrate the recommendations sections into `home-screen.vue`.
  - **File**: `src/presentation/views/home-screen.vue`
  - **Details**: Display "Recommended for You" sections above Trending if seeds exist.
- [ ] **Step 3.3: Handle Loading/Error States**: Ensure skeleton loaders and error states are correctly displayed for each recommendation section.

## Phase 4: Verification

- [ ] **Step 4.1: Automated Tests**: Run all unit and integration tests.
  - **Command**: `npm run test`
- [ ] **Step 4.2: Manual Verification**:
  - [ ] Verify recommendations appear for a library with rated items.
  - [ ] Verify "Because you liked {title}" labels are correct.
  - [ ] Verify no duplicates across sections.
  - [ ] Verify library entries are excluded.
  - [ ] Verify fallback to Trending/Popular when library is empty.
  - [ ] Verify independent error handling by mocking a failed API call for one seed.
