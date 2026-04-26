---
id: R-09
title: Cast Information
status: draft
importance: medium
type: functional
tags: [details, api, navigation, ui]
---

## Intent

Enable users to explore detailed information about cast members directly from movie and TV show detail pages. When a user clicks on an actor in the cast carousel, they navigate to a dedicated person detail page showing the actor's biography, career information, and filmography — enhancing discovery and providing context about the people behind the content.

## Context & Background

### Problem Statement

Currently, cast members are displayed in a carousel on movie/show detail pages with only basic information (name, character, profile photo). Users cannot learn more about actors or discover other movies/shows they've appeared in without leaving the app.

### User Stories

- As a user viewing a movie's cast, I want to click on an actor to see their biography so that I can learn more about them.
- As a user exploring an actor's profile, I want to see their filmography so that I can discover other movies and shows they've appeared in.
- As a user viewing an actor's profile, I want to see external links (IMDB, social media) so that I can find more information elsewhere.

### Dependencies

- **R-02 (Home Screen)**: Detail pages with cast carousel (existing)

## Scope

### In Scope

- Clickable cast member cards in the existing `CastCarousel` component
- New `/person/:id` route for person detail pages
- Person detail page displaying:
  - Profile image (hero section)
  - Name and known-for department (e.g., "Acting", "Directing")
  - Biography
  - Birth date, place of birth, death date (if applicable)
  - External links (IMDB, Instagram, Twitter)
  - Combined filmography (movies + TV shows)
- Filmography displayed as a combined list sorted by release date (newest first)
- Clickable filmography items that navigate to `/movie/:id` or `/show/:id`
- Loading skeleton states
- Error handling (404, network errors)
- i18n support for all UI text

### Out of Scope

- Following/favoriting actors
- Actor-related notifications
- Comparing actors
- Actor search
- Person images gallery (multiple photos)
- Actor awards and nominations
- Filtering filmography by genre/year
- Infinite scroll for filmography (display all results from single API call)

## Decisions

| Decision            | Choice                                | Rationale                                                                                |
| ------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| Page vs Modal       | Full page (`/person/:id`)             | Consistent with existing detail page patterns; supports deep linking and browser history |
| Filmography display | Combined list                         | User preference; simpler UI than tabbed or carousel approach                             |
| Filmography sorting | By release date (newest first)        | Most relevant/recent work appears first                                                  |
| API strategy        | Single call with `append_to_response` | Minimizes API calls; consistent with existing movie/show detail fetching                 |

## Functional Requirements

| ID    | Requirement            | Description                                                                 | Priority |
| ----- | ---------------------- | --------------------------------------------------------------------------- | -------- |
| CI-01 | Clickable cast cards   | Cast member cards in `CastCarousel` navigate to `/person/:id` when clicked  | P0       |
| CI-02 | Person route           | New route `/person/:id` with navigation guard rejecting non-numeric IDs     | P0       |
| CI-03 | Profile hero           | Display person's profile image prominently at the top of the page           | P0       |
| CI-04 | Basic info             | Display person's name and known-for department below the profile image      | P0       |
| CI-05 | Biography              | Display person's biography text; handle empty biographies gracefully        | P0       |
| CI-06 | Birth info             | Display birthday and place of birth; show death date if applicable          | P1       |
| CI-07 | External links         | Display clickable links to IMDB, Instagram, and Twitter when available      | P1       |
| CI-08 | Filmography list       | Display combined movie and TV credits as a scrollable list                  | P0       |
| CI-09 | Filmography sorting    | Sort filmography by release date descending (newest first)                  | P0       |
| CI-10 | Filmography navigation | Each filmography item navigates to `/movie/:id` or `/show/:id` when clicked | P0       |
| CI-11 | Loading state          | Show skeleton loader while person data is being fetched                     | P0       |
| CI-12 | Error handling         | Show appropriate error states for 404 (person not found) and network errors | P0       |
| CI-13 | Back navigation        | Provide a way to navigate back to the previous page                         | P1       |

## Non-Functional Requirements

### Responsive Design

- Profile image: 160×160px on mobile, 200×200px on desktop
- Filmography grid: 2 columns on mobile, 4-6 columns on desktop
- Biography text: full width, readable line length with appropriate padding

### Performance

- Single API call using `append_to_response=combined_credits,external_ids`
- Route lazy-loaded for code splitting
- Filmography images lazy-loaded

### Accessibility

- Semantic HTML (`<article>`, `<section>`, `<a>`)
- External links open in new tab with `rel="noopener noreferrer"`

## Constraints

- TMDB API rate limit: ~40 requests per 10 seconds (shared with other API calls)
- Biography text may be empty for lesser-known actors
- Some external IDs may be null (no Instagram, no Twitter, etc.)
- Filmography may include entries with null release dates (sort these last)

## UI/UX Specs

### Layout

- **Mobile**: Single column layout with profile image centered, biography below, filmography as 2-column grid
- **Desktop**: Profile image on left, name/bio/links on right, filmography below as multi-column grid

### Profile Hero

- Circular profile image with fallback placeholder (User icon) if `profile_path` is null
- Person name: `text-2xl font-bold text-white`
- Known-for department: `text-sm text-slate-400`

### Biography Section

- Section heading: "Biography"
- Body text: `text-sm text-slate-300`, max 6-8 lines with "Read more" expansion if longer
- Empty state: "No biography available." in muted text

### External Links

- Row of icon buttons (IMDB, Instagram, Twitter)
- Only show icons for links that exist (hide missing ones)
- Icons open external URLs in new tabs

### Filmography Section

- Section heading: "Filmography" with count (e.g., "Filmography (42)")
- Each item displays: poster thumbnail, title, year, character name
- Items styled consistently with existing `MovieCard` component
- Hover state: subtle scale-up consistent with card hover patterns

### Loading State

- Skeleton matching the page layout: circular profile placeholder, text lines for name/bio, grid of card skeletons for filmography

### Error States

- **404**: "Person not found" centered message with link to Home
- **Network error**: Toast notification with Retry action

## Acceptance Criteria

- [ ] Clicking a cast member card in the cast carousel navigates to `/person/:id`
- [ ] `/person/:id` route renders the person detail page
- [ ] Non-numeric IDs redirect to Home
- [ ] Profile image displays correctly (or fallback placeholder if null)
- [ ] Person name and known-for department display correctly
- [ ] Biography text displays (or empty state message if null/empty)
- [ ] Birth date and place of birth display when available
- [ ] Death date displays when applicable
- [ ] External links (IMDB, Instagram, Twitter) render as clickable icons
- [ ] External links open in new tabs
- [ ] Missing external links are not displayed (no broken icons)
- [ ] Filmography displays as a combined list of movies and TV shows
- [ ] Filmography is sorted by release date descending
- [ ] Entries with null release dates appear at the end of the list
- [ ] Clicking a filmography item navigates to the correct detail page
- [ ] Skeleton loader displays while data is loading
- [ ] Error toast appears on network failure with Retry action
- [ ] "Person not found" message appears for invalid person IDs
- [ ] Back navigation works correctly
- [ ] Page is responsive across all breakpoints
- [ ] All UI text uses i18n translation keys
