# Plan

## Phase 1: Domain Layer

### 1.1 Create Search Schema

- [ ] Create `src/domain/search.schema.ts`
  - Define `SearchResultItemSchema` extending base fields with `media_type: z.enum(['movie', 'tv', 'person'])`
  - Define `SearchResponseSchema` as `PaginatedResponseSchema` with `SearchResultItemSchema` items
  - Export inferred types: `SearchResultItem`, `SearchResponse`

### 1.2 Create Search Constants

- [ ] Update `src/domain/constants.ts`
  - Add `SEARCH_DEBOUNCE_MS = 300`
  - Add `MIN_SEARCH_QUERY_LENGTH = 1` (minimum characters to trigger search)

## Phase 2: Infrastructure Layer

### 2.1 Add Search API Method

- [ ] Update `src/infrastructure/provider.client.ts`
  - Add `searchMulti(query: string, language: string): Promise<SearchResponse>` method
  - Construct URL: `${API_BASE_URL}/search/multi` with query params: `query`, `language`, `page=1`, `include_adult=false`
  - Validate response with `SearchResponseSchema.parse()`
  - Rollback: method can be removed without affecting other client methods

## Phase 3: Application Layer

### 3.1 Create Search Composable

- [ ] Create `src/application/use-search.ts`
  - Signature: `useSearch()` returns `{ query, results, loading, error, search, clear }`
  - `query`: `Ref<string>` bound to SearchBar input
  - `results`: `Ref<(MovieListItem | ShowListItem)[]>` filtered to exclude `media_type === 'person'`
  - `loading`: `Ref<boolean>` true while API request in flight
  - `error`: `Ref<Error | null>` set on API failure
  - `search(query: string)`: triggers API call (called by debounced watcher)
  - `clear()`: resets query to empty string, clears results and error
  - Implement 300 ms debounce using `watchEffect` with `setTimeout`/`clearTimeout`
  - Filter results client-side: `results.filter(r => r.media_type === 'movie' || r.media_type === 'tv')`
  - Pass `Settings.language` from `useSettings()` to API call

## Phase 4: Presentation Layer

### 4.1 Create SearchBar Component

- [ ] Create `src/presentation/components/home/SearchBar.vue`
  - Props: `modelValue: string` (v-model binding)
  - Emits: `update:modelValue`
  - Template structure:
    - Wrapper `div` with `relative` positioning
    - Search icon (lucide `Search`) positioned left
    - `<input type="search">` with full width, padding for icons, dark background, white text
    - Clear button (lucide `X`) positioned right, visible only when input non-empty
  - Styling: `rounded-lg`, `bg-slate-800`, `text-white`, `placeholder-slate-400`
  - Placeholder text: use i18n key `home.search.placeholder` ("Search movies and shows...")
  - Clear button click: emit empty string

### 4.2 Create SearchResults Component

- [ ] Create `src/presentation/components/home/SearchResults.vue`
  - Props: `results: (MovieListItem | ShowListItem)[]`, `loading: boolean`, `error: Error | null`, `query: string`
  - Emits: `retry`
  - Template structure:
    - Loading state: render skeleton grid (6 MovieCardSkeleton on desktop, 2 on mobile)
    - Error state: inline error message with Retry button
    - Empty state: centered message when `results.length === 0` and `!loading` and `query.length > 0`
    - Results state: responsive grid of MovieCard components
  - MovieCard click handler: `router.push()` to `/movie/:id` or `/show/:id` based on `media_type`

### 4.3 Create MovieCardSkeleton Component

- [ ] Create `src/presentation/components/common/MovieCardSkeleton.vue`
  - Matches MovieCard dimensions (2:3 aspect ratio poster, title/year text lines)
  - Shimmer animation using `animate-pulse` or custom shimmer keyframe
  - No props needed

### 4.4 Update HomeScreen View

- [ ] Update `src/presentation/views/HomeScreen.vue`
  - Import and use `useSearch()` composable
  - Add `SearchBar` at top of content area, bound to `query`
  - Conditional rendering:
    - If `query` is empty: render browse sections (TrendingCarousel, PopularGrid, FilterBar, ViewToggle)
    - If `query` is non-empty: render `SearchResults` with results, loading, error, query props
  - Handle retry event from SearchResults: call `search()` with current query

### 4.5 Add i18n Keys

- [ ] Update `src/presentation/i18n/locales/en.json`
  - Add `home.search.placeholder`: "Search movies and shows..."
  - Add `home.search.empty.title`: "No results found"
  - Add `home.search.empty.subtitle`: "Try different keywords or check your spelling"
  - Add `home.search.error.message`: "Failed to load search results"
  - Add `home.search.error.retry`: "Retry"

- [ ] Update `src/presentation/i18n/locales/es.json`
  - Add Spanish translations for all keys above

- [ ] Update `src/presentation/i18n/locales/fr.json`
  - Add French translations for all keys above

## Phase 5: Testing

### 5.1 Domain Tests

- [ ] Create `tests/domain/search.schema.test.ts` (covering: HS-03, implementation detail)
  - Test `SearchResultItemSchema` parses valid movie result
  - Test `SearchResultItemSchema` parses valid TV result
  - Test `SearchResultItemSchema` parses valid person result (before filtering)
  - Test `SearchResponseSchema` parses paginated response

### 5.2 Infrastructure Tests

- [ ] Create `tests/infrastructure/provider.client.search.test.ts` (covering: HS-02, implementation detail)
  - Test `searchMulti()` constructs correct URL with query params
  - Test `searchMulti()` returns validated response
  - Test `searchMulti()` handles API error responses

### 5.3 Application Tests

- [ ] Create `tests/application/use-search.test.ts` (covering: HS-01, HS-03, HS-06, HS-07, HS-08, HS-09, HS-10, HS-11)
  - Test debounce behavior: multiple rapid inputs trigger single API call
  - Test results filtering: person results excluded
  - Test loading state transitions: idle → loading → success
  - Test error state: API failure sets error ref
  - Test clear: resets query, results, and error
  - Test empty results: results array empty when API returns no matches

### 5.4 Presentation Tests

- [ ] Create `tests/presentation/components/home/SearchBar.test.ts` (covering: HS-01, implementation detail)
  - Test v-model binding updates on input
  - Test clear button appears when input non-empty
  - Test clear button click emits empty string

- [ ] Create `tests/presentation/components/home/SearchResults.test.ts` (covering: HS-04, HS-05, HS-06, HS-07, HS-08)
  - Test renders skeleton grid when loading
  - Test renders error message with retry button when error
  - Test renders empty state when results empty and query non-empty
  - Test renders MovieCard grid when results present
  - Test MovieCard click navigates to correct route

## Phase 6: Verification

- [ ] Run `npm run lint` — no ESLint errors
- [ ] Run `npm run build` — production build succeeds
- [ ] Run `npm run test` — all tests pass
- [ ] Manual verification:
  - Type in SearchBar, observe 300 ms debounce before results appear
  - Verify only movie/TV results shown (no person cards)
  - Verify each card shows poster, title, year, vote average
  - Verify tapping movie card navigates to `/movie/:id`
  - Verify tapping TV card navigates to `/show/:id`
  - Search for nonexistent term, verify empty state
  - Verify loading skeleton appears during API call
  - Simulate API error (offline), verify inline error with Retry
  - Clear search, verify browse sections return
