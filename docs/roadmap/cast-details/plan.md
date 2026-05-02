# Cast Information — Implementation Plan

Feature ID: R-09

## Phase 1: Domain Testing

- [ ] **1.1** Create `tests/domain/person.schema.test.ts`:
  - Test valid `PersonDetailWithCreditsSchema` parsing for profile, name, department, biography, birth/death fields, combined credits, and external IDs (covering: CI-03-01, CI-04-01, CI-05-01, CI-06-01, CI-06-02, CI-07-01)
  - Test movie and TV `PersonCreditSchema` variants with concrete TMDB fields (`title`/`release_date` for movies, `name`/`first_air_date` for TV) (covering: CI-08-03, CI-10-01, CI-10-02)
  - Test null profile, null external IDs, null dates, and empty credits parse correctly (covering: CI-03-02, CI-07-03, CI-09-02, CI-14-01)
  - (implementation detail) Test invalid API response data is rejected by Zod

- [ ] **1.2** Create `tests/domain/person.logic.test.ts`:
  - Test `sortCreditsByDate` with mixed movie/TV dates and null dates (covering: CI-09-01, CI-09-02)
  - Test `deduplicateCredits` uses `(media_type, id)` and keeps the lowest `order` entry for duplicate roles in the same title (covering: CI-08-06)
  - Test `formatBirthInfo` and `formatDeathInfo` for complete, partial, and missing dates (covering: CI-06-01, CI-06-02, CI-06-03)
  - Test `hasExternalLinks` true/false cases and `buildExternalUrl` for IMDB, Instagram, and Twitter (covering: CI-07-01, CI-07-02, CI-07-03, CI-07-04)

- [ ] **1.3** Run `npm run test -- tests/domain/person.schema.test.ts tests/domain/person.logic.test.ts` and confirm the new tests fail before implementation.

## Phase 2: Domain Layer

- [ ] **2.1** Create `src/domain/person.schema.ts` with Zod schemas:
  - `PersonDetailSchema` — `id` (number), `name` (string), `biography` (string), `birthday` (string|null), `deathday` (string|null), `place_of_birth` (string|null), `profile_path` (string|null), `known_for_department` (string), `also_known_as` (string[]), `homepage` (string|null)
  - `ExternalIdsSchema` — `imdb_id` (string|null), `instagram_id` (string|null), `twitter_id` (string|null)
  - `PersonMovieCreditSchema` — `id` (number), `media_type` (`'movie'`), `title` (string), `character` (string|null), `release_date` (string|null), `poster_path` (string|null), `order` (number|null)
  - `PersonTvCreditSchema` — `id` (number), `media_type` (`'tv'`), `name` (string), `character` (string|null), `first_air_date` (string|null), `poster_path` (string|null), `order` (number|null)
  - `PersonCreditSchema` — discriminated union of movie and TV credit schemas
  - `PersonDetailWithCreditsSchema` — extends `PersonDetailSchema` with `combined_credits.cast` (`PersonCreditSchema[]`) and `external_ids` (`ExternalIdsSchema`)
  - Export inferred types: `PersonDetail`, `ExternalIds`, `PersonCredit`, `PersonDetailWithCredits`

- [ ] **2.2** Create `src/domain/person.logic.ts` with pure functions:
  - `sortCreditsByDate(credits: PersonCredit[]): PersonCredit[]` — sorts descending by `release_date`/`first_air_date`, nulls last
  - `deduplicateCredits(credits: PersonCredit[]): PersonCredit[]` — removes duplicate `(media_type, id)` entries, keeping the lowest `order` value
  - `formatBirthInfo(birthday: string|null, placeOfBirth: string|null): string|null` — formats as `"Month DD, YYYY • City, Country"` or partial
  - `formatDeathInfo(deathday: string|null): string|null` — formats as `"Month DD, YYYY"`
  - `hasExternalLinks(externalIds: ExternalIds): boolean` — returns true if any of `imdb_id`, `instagram_id`, or `twitter_id` is non-null
  - `buildExternalUrl(type: 'imdb'|'instagram'|'twitter', id: string): string` — returns the full external URL
  - Add JSDoc to every exported function, including parameters and return values

- [ ] **2.3** Run `npm run test -- tests/domain/person.schema.test.ts tests/domain/person.logic.test.ts`; domain tests should pass.

## Phase 3: Infrastructure Testing

- [ ] **3.1** Create `tests/infrastructure/provider.client.person.test.ts`:
  - Test successful person fetch passes both `language={Settings.language}` and `append_to_response=combined_credits,external_ids` (covering: CI-04-02; validates CI-NFR-04)
  - Test successful response parsing through `PersonDetailWithCreditsSchema` (covering: CI-03-01, CI-04-01, CI-08-03)
  - Test 404 response handling (covering: CI-12-01)
  - Test network error handling without automatic retry (covering: CI-12-02)
  - Test 500+ server error handling without automatic retry (covering: CI-12-04)
  - (implementation detail) Test Zod validation failure

- [ ] **3.2** Run `npm run test -- tests/infrastructure/provider.client.person.test.ts` and confirm the new tests fail before implementation.

## Phase 4: Infrastructure Layer

- [ ] **4.1** Update `src/infrastructure/provider.client.ts`:
  - Add `getPersonDetails(id: number, language: string): Promise<PersonDetailWithCredits>`
  - Endpoint path: `/person/{id}`
  - Query params: `language` from `Settings.language` and `append_to_response=combined_credits,external_ids`
  - Parse response with `PersonDetailWithCreditsSchema`
  - Follow existing provider error handling patterns: 404 passes through for inline not-found handling, 429 uses automatic backoff, network and 500+ server errors surface to callers for manual retry
  - Add JSDoc for the exported `getPersonDetails` function

- [ ] **4.2** Run `npm run test -- tests/infrastructure/provider.client.person.test.ts`; infrastructure tests should pass.

## Phase 5: Application Testing

- [ ] **5.1** Create `tests/application/use-person.test.ts`:
  - Test loading state transitions: idle → loading → success with `data` populated (covering: CI-11-01)
  - Test loading state transitions: idle → loading → error with `error` populated (covering: CI-12-02)
  - Test server error state exposes `error` for manual retry (covering: CI-12-04)
  - Test `refresh` re-fetches data after an error (covering: CI-12-03)
  - Test current `Settings.language` is passed to `getPersonDetails` (covering: CI-04-02; validates CI-NFR-04)
  - Test returned `data.filmography` is deduplicated and sorted before Presentation receives it (covering: CI-08-06, CI-09-01, CI-09-02)
  - Test returned view data includes formatted birth/death info and external link URLs (covering: CI-06-01, CI-06-02, CI-07-02)
  - (implementation detail) Test id reactivity triggers a new fetch

- [ ] **5.2** Run `npm run test -- tests/application/use-person.test.ts` and confirm the new tests fail before implementation.

## Phase 6: Application Layer

- [ ] **6.1** Create `src/application/use-person.ts`:
  - Export `usePerson(id: MaybeRef<number>)`
  - Import `useSettings()` and call `getPersonDetails(toValue(id), language.value)`
  - Use Domain functions to deduplicate, sort, format dates, and build external URLs inside the Application layer
  - Return the standard shape `{ data, loading, error, refresh }`
  - `data` is `Ref<PersonPageData|null>` where `PersonPageData` is an Application-facing view model containing profile fields, formatted birth/death strings, external link view models, and sorted/deduplicated filmography view models
  - Export Application-facing types such as `PersonPageData`, `PersonExternalLinkViewModel`, and `PersonCreditViewModel` for Presentation props; Presentation must not import Domain types or Domain functions
  - Watch the id ref for route changes and re-fetch on change
  - Add JSDoc for the exported `usePerson` composable

- [ ] **6.2** Run `npm run test -- tests/application/use-person.test.ts`; application tests should pass.

## Phase 7: Routing Testing

- [ ] **7.1** Create `tests/presentation/router.person.test.ts`:
  - Test `/person/500` resolves to the person route (covering: CI-02-01)
  - Test `/person/abc` redirects to `/` (covering: CI-02-02)
  - Test `/person/123abc` redirects to `/` (covering: CI-02-03)
  - (implementation detail) Test route component is lazy-loaded via dynamic import (validates CI-NFR-05)

- [ ] **7.2** Run `npm run test -- tests/presentation/router.person.test.ts` and confirm the new tests fail before implementation.

## Phase 8: Routing

- [ ] **8.1** Update `src/presentation/router.ts`:
  - Add route `{ path: '/person/:id', component: () => import('./views/person-screen.vue') }`
  - Add navigation guard: reject non-numeric `:id`, redirect to `/`
  - Place route alongside existing `/movie/:id` and `/show/:id` routes

- [ ] **8.2** Run `npm run test -- tests/presentation/router.person.test.ts`; routing tests should pass.

## Phase 9: Presentation Testing

- [ ] **9.1** Create component tests for person detail components, mocking only Application-facing data shapes:
  - `tests/presentation/components/details/person-bio.test.ts` covers truncation, expansion, empty state, and localized controls (covering: CI-05-01, CI-05-02, CI-05-03, CI-05-04, CI-05-05)
  - `tests/presentation/components/details/person-links.test.ts` covers available/missing links, `target="_blank"`, `rel="noopener noreferrer"`, and accessible labels (covering: CI-07-01, CI-07-02, CI-07-03, CI-07-04; validates CI-NFR-08)
  - `tests/presentation/components/details/filmography-card.test.ts` covers displayed fields, media badges, lazy poster images, keyboard activation, and mobile touch target sizing (covering: CI-08-03, CI-08-04, CI-08-05, CI-10-01, CI-10-02, CI-10-03, CI-10-04; validates CI-NFR-06, CI-NFR-10)

- [ ] **9.2** Create `tests/presentation/views/person-screen.test.ts`, mocking `usePerson()` and `useToast()`:
  - Test skeleton displays during loading with live region semantics and respects reduced-motion settings (covering: CI-11-01, CI-11-02; validates CI-NFR-11)
  - Test person data renders profile image/name/department/biography/birth info/filmography (covering: CI-03-01, CI-03-02, CI-04-01, CI-05-01, CI-06-01, CI-08-01, CI-08-02, CI-08-03)
  - Test large filmography renders without duplicate or ordering regressions (covering: CI-08-06, CI-08-07, CI-09-01, CI-09-02)
  - Test 404 state displays localized `person.notFound` text with Home link and alert semantics (covering: CI-12-01; validates CI-NFR-11)
  - Test network error dispatches a localized toast with Retry action, and clicking Retry calls `refresh` (covering: CI-12-02, CI-12-03)
  - Test 500+ server error dispatches a localized toast with Retry action (covering: CI-12-04)
  - Test empty filmography message (covering: CI-14-01)
  - Test browser back and back arrow behavior, including minimum touch target sizing (covering: CI-13-01, CI-13-02, CI-13-03)
  - (implementation detail) Test semantic article/section/link structure and visible focus states (validates CI-NFR-07, CI-NFR-09)

- [ ] **9.3** Run the new presentation tests and confirm they fail before implementation.

## Phase 10: Presentation Components and View

- [ ] **10.1** Create `src/presentation/components/details/person-hero.vue`:
  - Props: `name: string`, `knownForDepartment: string`, `profilePath: string|null`
  - Display circular profile image (200×200px desktop, 160×160px mobile) with User icon fallback
  - Display name (`text-2xl font-bold text-white`) and known-for department (`text-sm text-slate-400`)
  - Responsive layout: centered on mobile, left-aligned on desktop

- [ ] **10.2** Create `src/presentation/components/details/person-bio.vue`:
  - Props: `biography: string|null`
  - Section heading with i18n key `person.biography`
  - Display biography text with `line-clamp-6`, `person.readMore` / `person.readLess` expansion button
  - Empty state with i18n key `person.biographyEmpty`

- [ ] **10.3** Create `src/presentation/components/details/person-info.vue`:
  - Props: `birthInfo: string|null`, `deathInfo: string|null`
  - Display formatted birth info and death info from Application-provided strings
  - Hide section entirely if both values are null
  - i18n keys: `person.born`, `person.died`

- [ ] **10.4** Create `src/presentation/components/details/person-links.vue`:
  - Props: `links: PersonExternalLinkViewModel[]` imported from `src/application/use-person.ts`
  - Display row of icon links for IMDB, Instagram, and Twitter entries present in `links`
  - Hide entire section when `links.length === 0`
  - Open links in new tab with `target="_blank" rel="noopener noreferrer"`
  - Use localized accessible labels such as `person.external.imdb`

- [ ] **10.5** Create `src/presentation/components/details/filmography-card.vue`:
  - Props: `credit: PersonCreditViewModel` imported from `src/application/use-person.ts`
  - Display poster thumbnail (w185 size) with placeholder fallback
  - Display title, localized year label (or `person.tba` if null), localized media type badge (`person.media.movie` / `person.media.tv`), and character name
  - Render as `RouterLink` to the Application-provided route (`/movie/:id` or `/show/:id`)
  - Hover state uses `transition-transform duration-200 ease-in-out`
  - Lazy load poster image with `loading="lazy"`

- [ ] **10.6** Create `src/presentation/components/details/filmography-grid.vue`:
  - Props: `credits: PersonCreditViewModel[]`
  - Section heading with i18n key `person.filmography` and count
  - Responsive grid: 2 columns below `md`, 3 at `md`, 4 at `lg`, 6 at `xl` and above
  - Render `FilmographyCard` for each credit
  - Empty state with i18n key `person.creditsEmpty`

- [ ] **10.7** Create `src/presentation/components/details/person-skeleton.vue`:
  - Skeleton layout matching `PersonScreen`
  - Circular profile placeholder, text lines for name/bio, grid of card skeletons
  - Use `animate-pulse` for shimmer effect and disable pulse animation under `prefers-reduced-motion`

- [ ] **10.8** Create `src/presentation/views/person-screen.vue`:
  - Use `usePerson()` composable with route param and read `data`, `loading`, `error`, and `refresh`
  - Conditional rendering: skeleton (loading), inline 404 state, network and 500+ server error state, content
  - Compose `PersonHero`, `PersonBio`, `PersonInfo`, `PersonLinks`, and `FilmographyGrid` from Application-provided view data
  - Do not import Domain types, Domain functions, or Infrastructure
  - Back button uses `router.back()` when history exists and falls back to `/` on direct entry
  - Network and 500+ server errors dispatch localized toasts with a localized `person.retry` action that calls `refresh`
  - Semantic HTML: page root `<article>`; biography, info, links, and filmography use `<section>` with headings
  - `aria-live="polite"` on loading region; `role="alert"` on error region

## Phase 11: CastCarousel Testing

- [ ] **11.1** Update `tests/presentation/components/details/cast-carousel.test.ts`:
  - Test click on cast member navigates to `/person/:id` (covering: CI-01-01)
  - Test cast member card is a focusable RouterLink and Enter activates it (covering: CI-01-02)

- [ ] **11.2** Run `npm run test -- tests/presentation/components/details/cast-carousel.test.ts` and confirm the new tests fail before implementation.

## Phase 12: CastCarousel Update

- [ ] **12.1** Update `src/presentation/components/details/cast-carousel.vue`:
  - Change cast member container from `<div>` to a `<RouterLink>` whose `to` target is `/person/${member.id}`
  - Add pointer affordance and hover styling consistent with existing card hover patterns
  - Maintain existing layout, cast ordering, profile fallback, and text rendering

- [ ] **12.2** Run `npm run test -- tests/presentation/components/details/cast-carousel.test.ts`; CastCarousel tests should pass.

## Phase 13: i18n

- [ ] **13.1** Update locale-key tests to require the new person keys in `en.json`, `es.json`, and `fr.json`:
  - Text keys: `person.biography`, `person.biographyEmpty`, `person.readMore`, `person.readLess`, `person.born`, `person.died`, `person.filmography`, `person.creditsEmpty`, `person.notFound`, `person.backToHome`, `person.retry`, `person.tba`
  - Media labels: `person.media.movie`, `person.media.tv`
  - External link labels: `person.external.imdb`, `person.external.instagram`, `person.external.twitter`
  - Error/back labels: `person.error`, `person.back`

- [ ] **13.2** Run `npm run test -- tests/presentation/i18n/locale-keys.test.ts` and confirm the locale-key tests fail before implementation.

- [ ] **13.3** Add all person keys to `src/presentation/i18n/locales/en.json`, `es.json`, and `fr.json`; rerun locale-key tests and presentation tests.

## Phase 14: Documentation

- [ ] **14.1** Update `docs/technical/api.md`:
  - Add Person endpoint section: `GET /person/{id}` with `language={Settings.language}` and `append_to_response=combined_credits,external_ids`
  - Document `PersonDetail`, `PersonCredit`, and `ExternalIds` response types
  - Add curl example including `language`

- [ ] **14.2** Update `docs/technical/architecture.md`:
  - Add `/person/:id` to routing table with purpose "Person details"
  - Note that it follows the same numeric guard, lazy loading, skeleton, inline 404, and manual retry behavior as movie/show detail routes

- [ ] **14.3** Update `docs/product/04 - entry-details/requirements.md`:
  - Document that `CastCarousel` cast cards navigate to `/person/:id`
  - Note that the existing cast display remains capped and sorted by billing order

- [ ] **14.4** Review `docs/product/02 - home/requirements.md` and update only if its detail-page navigation text needs a cross-reference to person pages.

## Phase 15: Verification

- [ ] **15.1** Run `npm run test` — all tests pass
- [ ] **15.2** Run `npm run build` — no build errors
- [ ] **15.3** Run `npm run type-check` — no type errors
- [ ] **15.4** Run `npm run lint` — no lint errors
- [ ] **15.5** Manual verification:
  - Navigate to movie detail → click cast member → person page loads
  - Verify profile image, name, department display correctly
  - Verify biography with Read more expansion
  - Verify birth/death info displays when available
  - Verify external links open in new tabs
  - Verify filmography grid with correct sorting and deduplication
  - Verify responsive layout at all breakpoints
  - Verify skeleton loader during API fetch
  - Verify numeric missing person ID shows 404 state
  - Verify non-numeric person ID redirects home
  - Verify Retry action re-fetches after a network error
  - Verify Retry action re-fetches after a 500+ server error
  - Verify back navigation works from in-app and direct-entry flows
  - Verify new public Domain, Infrastructure, and Application exports include JSDoc
