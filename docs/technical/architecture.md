# Architecture

## Overview

The app follows a **3-layer client-only architecture**: Vue components consume reactive data from composables, which in turn delegate to plain TypeScript services for API calls and persistence. There is no backend — all user data lives in localStorage, and all movie/show metadata comes from the API. Every data boundary (API responses, storage reads, user input) is validated with Zod schemas before use.

## Folder Structure

```
src/
├── main.ts                    # App entry point — creates Vue app, registers router
├── App.vue                    # Root component — error boundary + router outlet
├── router/
│   └── index.ts               # Route definitions and navigation guards
├── components/                # Vue SFCs organized by feature
│   ├── layout/                # App shell, navigation, shared layout wrappers
│   ├── common/                # Reusable UI pieces (cards, search bar, filters)
│   ├── home/                  # Home screen, search results, trending/popular
│   ├── details/               # Movie/TV detail view and subcomponents
│   ├── library/               # Watchlist, watched, custom lists
│   ├── stats/                 # Charts and analytics
│   ├── recommendations/       # Recommendation views
│   ├── calendar/              # Release calendar
│   ├── settings/              # User preferences
│   └── error/                 # Error boundary fallback
├── composables/               # Vue Composition API hooks (use* functions)
├── services/                  # Pure TS — API client, storage, caching
├── types/                     # Zod schemas and TypeScript type definitions
├── utils/                     # Pure helper functions (formatting, sanitization)
├── config/                    # Constants (API_BASE_URL, CACHE_TTL, etc.)
└── assets/                    # Static files and Tailwind entry CSS
```

## Layers

```
┌─────────────────────────────────────────┐
│             Components (UI)             │  Vue SFCs — render UI, emit events
│         imports composables only        │
├─────────────────────────────────────────┤
│       Composables (Logic + State)       │  Wrap services with Vue reactivity
│     imports services + types only       │  Expose { data, loading, error }
├─────────────────────────────────────────┤
│        Services (Integration)           │  Pure TS — HTTP, localStorage, cache
│       imports types + utils only        │  No Vue dependencies
├─────────────────────────────────────────┤
│          Types + Utils (Core)           │  Zod schemas, TS types, helpers
│           no app imports                │
└─────────────────────────────────────────┘
```

### Components

Vue 3 SFCs using `<script setup>` and Tailwind. Components call composables to access data and never import services directly. Organized by feature area under `components/`.

### Composables

Functions prefixed with `use` that wrap service calls with Vue reactivity (`ref`, `computed`, `watchEffect`). Each composable returns a standard shape: `{ data, loading, error, refresh? }`. This is the **only public API** that components use to read or mutate data.

### Services

Plain TypeScript classes with no Vue dependencies. Handle all external integration:

- **`ApiService`** — API client with auth, Zod response validation, and circuit breaker for rate limits.
- **`StorageService`** — Typed localStorage wrapper with Zod validation on reads and schema migration between versions.
- **Cache layer** — localStorage-backed response cache with TTL to reduce redundant API calls.

### Types

Zod schemas that define the shape of all data at boundaries (API responses, localStorage entries, user input). TypeScript types are inferred from schemas with `z.infer<>`.

### Utils

Stateless helper functions: date/number formatting, image URL construction, input sanitization.

## Data Flow

### Read path (API → screen)

```
External API
  → ApiService.getMovie(id)         # HTTP fetch + Zod validation
    → useMovie(id)                   # Wraps in ref(), tracks loading/error
      → EntryDetails.vue             # Renders reactive data in template
```

### Write path (user action → storage)

```
User clicks "Add to Watchlist"
  → EntryDetails.vue calls useLibrary().addToWatchlist(id)
    → StorageService.updateEntry()   # Validates with Zod, writes localStorage
      → useLibrary() reactive state updates
        → Component re-renders with new status
```

## Routing

Routes are defined in `src/router/index.ts` using Vue Router.

| Path                | View             | Purpose                          |
| ------------------- | ---------------- | -------------------------------- |
| `/`                 | Home             | Search bar, trending, popular    |
| `/movie/:id`        | Movie details    | Full movie info, actions         |
| `/tv/:id`           | TV show details  | Full show info, actions          |
| `/library`          | Library          | Watchlist, watched, custom lists |
| `/stats`            | Stats            | Viewing history analytics        |
| `/recommendations`  | Recommendations  | Personalized suggestions         |
| `/calendar`         | Release calendar | Upcoming releases                |
| `/settings`         | Settings         | Theme, language, data export     |

**Navigation:** Sidebar on desktop, bottom navigation bar on mobile. Both link to the same routes.

## Component Hierarchy

```
App.vue
└── ErrorBoundary
    └── AppShell (sidebar/bottom nav + router outlet)
        ├── / → HomeScreen
        │       ├── SearchBar → SearchResults → MovieCard[]
        │       ├── TrendingCarousel → MovieCard[]
        │       └── PopularGrid → MovieCard[]
        │
        ├── /movie/:id, /tv/:id → EntryDetails
        │       ├── HeroBackdrop
        │       ├── MetadataPanel
        │       ├── CastCarousel
        │       ├── TrailerEmbed
        │       ├── StreamingBadges
        │       └── RatingStars
        │
        ├── /library → LibraryScreen
        │       ├── TabToggle (watchlist / watched / lists)
        │       ├── FilterBar
        │       ├── SortDropdown
        │       └── EntryGrid → MovieCard[]
        │
        ├── /stats → StatsScreen
        │       ├── StatCards
        │       ├── GenreChart
        │       ├── MonthlyChart
        │       └── TopRatedList
        │
        ├── /recommendations → RecommendationsScreen
        ├── /calendar → ReleaseCalendar → CalendarGrid → ReleaseCard[]
        └── /settings → SettingsScreen
```

## State Management

No external state library (no Pinia/Vuex). State is managed across three tiers:

| Tier                  | What lives here                                | Mechanism                                                             |
| --------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| **Component-local**   | UI toggles, form inputs, modal open/close      | `ref()` / `computed()` inside `<script setup>`                        |
| **Composable-shared** | Library entries, search results, trending data | `ref()` inside composables, shared across components                  |
| **Persistent**        | User library, lists, tags, settings, API cache | localStorage via `StorageService` (see [Data Model](./data-model.md)) |

API responses are cached in localStorage with a TTL to avoid redundant requests. All persistent data is validated with Zod on read to guard against corruption or schema drift.
