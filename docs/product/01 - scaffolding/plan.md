# Implementation Plan: App Scaffolding

---

## Phase 1 — Router & Dependencies

### Step 1 — Install vue-router

- [ ] Run `npm install vue-router@^4`.

### Step 2 — Create router configuration

- [ ] Create `src/presentation/router.ts`:

- `createWebHistory()` for clean URLs
- `scrollBehavior` returning `{ top: 0 }` on every navigation
- 5 routes with lazy-loaded views via `() => import('./views/...')`
- Catch-all `/:pathMatch(.*)*` redirecting to `/`
- `meta.titleKey` on each route (e.g., `nav.home`, `nav.library`)
- `afterEach` guard setting `document.title` via i18n: `${t(titleKey)} — Plot Twisted`
- TypeScript `RouteMeta` augmentation for `titleKey`

**Routes:**

| Path               | Name       | View File             | titleKey       |
| :----------------- | :--------- | :-------------------- | :------------- |
| `/`                | `home`     | `home-screen.vue`     | `nav.home`     |
| `/library`         | `library`  | `library-screen.vue`  | `nav.library`  |
| `/stats`           | `stats`    | `stats-screen.vue`    | `nav.stats`    |
| `/calendar`        | `calendar` | `calendar-screen.vue` | `nav.calendar` |
| `/settings`        | `settings` | `settings-screen.vue` | `nav.settings` |
| `/:pathMatch(.*)*` | —          | —                     | redirect `/`   |

### Step 3 — Register router

- [ ] Modify `src/main.ts` to import router and register with `app.use(router)`.

---

## Phase 2 — i18n Keys

### Step 4 — Update locale files

- [ ] Add keys to `en.json`, `es.json`, `fr.json`:

**Key structure:**

```
nav.home / nav.library / nav.stats / nav.calendar / nav.settings
page.home.title / page.library.title / page.stats.title / page.calendar.title / page.settings.title
common.empty.title / common.empty.description
common.error.title / common.error.description / common.error.reload
toast.error / toast.dismiss / toast.retry
```

**Translations:**

| Key                        | English                          | Spanish                           | French                                |
| :------------------------- | :------------------------------- | :-------------------------------- | :------------------------------------ |
| `nav.home`                 | Home                             | Inicio                            | Accueil                               |
| `nav.library`              | Library                          | Biblioteca                        | Bibliotheque                          |
| `nav.stats`                | Stats                            | Estadisticas                      | Statistiques                          |
| `nav.calendar`             | Calendar                         | Calendario                        | Calendrier                            |
| `nav.settings`             | Settings                         | Ajustes                           | Parametres                            |
| `common.empty.title`       | Nothing here yet                 | Nada aqui todavia                 | Rien ici pour le moment               |
| `common.empty.description` | This page is under construction. | Esta pagina esta en construccion. | Cette page est en construction.       |
| `common.error.title`       | Something went wrong             | Algo salio mal                    | Une erreur est survenue               |
| `common.error.description` | An unexpected error occurred.    | Ocurrio un error inesperado.      | Une erreur inattendue s'est produite. |
| `common.error.reload`      | Reload                           | Recargar                          | Recharger                             |
| `toast.error`              | An error occurred                | Ocurrio un error                  | Une erreur est survenue               |
| `toast.dismiss`            | Dismiss                          | Cerrar                            | Fermer                                |
| `toast.retry`              | Retry                            | Reintentar                        | Reessayer                             |

`page.*.title` keys mirror `nav.*` values initially (separate keys to allow divergence later).

---

## Phase 3 — Composables

### Step 5 — Toast composable

- [ ] Create `src/presentation/composables/use-toast.ts`:

- Module-level `ref<Toast[]>` (singleton — shared across all callers, works outside `setup()`)
- `Toast` type: `{ id: string, message: string, type: 'error' | 'success' | 'info', action?: { label: string, handler: () => void } }`
- `addToast(options)` — generates unique id, pushes toast, starts `setTimeout` (~4s) for auto-removal
- `removeToast(id)` — removes from array
- Returns `{ toasts: Readonly<Ref<Toast[]>>, addToast, removeToast }`

### Step 6 — Modal composable

- [ ] Create `src/presentation/composables/use-modal.ts`:

- Module-level `ref<boolean>` + `shallowRef<ModalProps | null>` (single modal at a time)
- `ModalProps` type: `{ title: string, content?: string, confirmLabel?: string, cancelLabel?: string, onConfirm?: () => void, onCancel?: () => void }`
- `open(props)` — sets visible true, stores props
- `close()` — sets visible false, clears props
- Returns `{ isOpen: Readonly<Ref<boolean>>, props: Readonly<ShallowRef<ModalProps | null>>, open, close }`

---

## Phase 4 — Layout Components

### Step 7 — Sidebar navigation

- [ ] Create `src/presentation/components/layout/sidebar-nav.vue`:

- Fixed left sidebar, `w-56`, `bg-bg-secondary`
- App title at top using `$t('app.title')`
- Nav items array: `{ to: string, labelKey: string, icon: Component }`
- Icons from lucide-vue-next: `Home`, `BookMarked`, `BarChart3`, `CalendarDays`, `Settings`
- Each item is a `<RouterLink>` with icon + `$t(labelKey)`
- Active state: `border-l-2 border-accent bg-accent/10 text-white`
- Inactive state: `text-slate-400 hover:text-white`
- Home route: exact match only (`route.path === '/'`)

### Step 8 — Bottom navigation

- [ ] Create `src/presentation/components/layout/bottom-nav.vue`:

- Fixed bottom bar (`fixed bottom-0 inset-x-0`), `z-10`
- Same 5 nav items with icons and short labels
- Active item: teal accent color, inactive: muted
- Dark background with subtle top border
- Hidden at `md+`, visible below `md`

### Step 9 — Page header

- [ ] Create `src/presentation/components/layout/page-header.vue`:

- Reads `route.meta.titleKey`, translates via `$t()`
- White text, `text-xl font-bold`

### Step 10 — App shell

- [ ] Create `src/presentation/components/layout/app-shell.vue`:

- Flexbox layout: `<SidebarNav>` (visible by default, `max-md:hidden`) + content area (`flex-1`)
- Content area: `pb-16 md:pb-0` (clearance for bottom nav on mobile)
- Renders `<PageHeader>` at top of content
- `<RouterView v-slot="{ Component }">` wrapped in `<Transition name="fade" mode="out-in">`
- `<BottomNav>` (hidden by default, `max-md:fixed`)
- `<ToastContainer>` as global overlay

---

## Phase 5 — Common Components

### Step 11 — Skeleton loader

- [ ] Create `src/presentation/components/common/skeleton-loader.vue`:

- Props: `width` (string, default `'100%'`), `height` (string, default `'1rem'`), `rounded` (string, default `'rounded-md'`)
- Single `<div>` with `animate-pulse bg-surface` and configured dimensions

### Step 12 — Empty state

- [ ] Create `src/presentation/components/common/empty-state.vue`:

- Props: `icon` (component, optional), `title` (string), `description` (string)
- Centered vertically and horizontally
- Icon in `text-slate-500`, title in `text-white font-bold`, description in `text-slate-400`

### Step 13 — Toast container

- [ ] Create `src/presentation/components/common/toast-container.vue`:

- Fixed `top-4 right-4 z-50`
- Uses `useToast()` to read the toast queue
- Each toast: dark surface card, type-colored left border (error → red, success → green, info → teal)
- Dismiss X button + optional action button
- `<TransitionGroup>` for animated enter (slide from right) / leave (fade out)

### Step 14 — Modal dialog

- [ ] Create `src/presentation/components/common/modal-dialog.vue`:

- Uses `useModal()` to read open/close state and props
- Backdrop: `bg-black/50`, click-to-close
- Content card: centered, `bg-surface rounded-lg`
- Title, optional body text, confirm (teal) and cancel buttons
- Escape key closes via `@keydown.escape` listener
- `<Transition>`: fade backdrop + scale content

---

## Phase 6 — Error Handling

### Step 15 — Error boundary

- [ ] Create `src/presentation/components/error/error-boundary.vue`:

- Uses `onErrorCaptured` lifecycle hook
- Normal state: renders `<slot />`
- Error state: centered fallback with `$t('common.error.title')`, `$t('common.error.description')`, and reload button calling `window.location.reload()`

### Step 16 — Global error handler

- [ ] Modify `src/main.ts` to add `app.config.errorHandler`:

- Logs the error to `console.error`
- Calls `useToast().addToast({ message: i18n.global.t('toast.error'), type: 'error' })`

---

## Phase 7 — Placeholder Views

### Step 17 — Create 5 view files

- [ ] Create placeholder views in `src/presentation/views/`:

| File                  | Icon Import    | Title Key             |
| :-------------------- | :------------- | :-------------------- |
| `home-screen.vue`     | `Home`         | `page.home.title`     |
| `library-screen.vue`  | `BookMarked`   | `page.library.title`  |
| `stats-screen.vue`    | `BarChart3`    | `page.stats.title`    |
| `calendar-screen.vue` | `CalendarDays` | `page.calendar.title` |
| `settings-screen.vue` | `Settings`     | `page.settings.title` |

Each view follows the same pattern: `<script setup>` imports `EmptyState`, the lucide icon, and `useI18n`. Template renders `<EmptyState>` with the icon and translated title/description.

---

## Phase 8 — App.vue & Tailwind

### Step 18 — Update App.vue

- [ ] Replace `src/App.vue` template with `<ErrorBoundary>` wrapping `<AppShell />`.

### Step 19 — Update Tailwind theme

- [ ] Add to `src/assets/main.css` `@theme` block:

- `--color-success: #22c55e`
- `--color-error: #ef4444`

- [ ] Add fade transition CSS after the `@theme` block:

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

---

## Phase 9 — Tests

### Step 20 — Install test utilities

- [ ] Run `npm install -D @vue/test-utils@^2`.

### Step 21 — Router unit tests

- [ ] Create `tests/presentation/router.test.ts`:

- All 5 named routes exist with correct paths and names
- Catch-all `/:pathMatch(.*)*` route exists and redirects to `/`
- `scrollBehavior` returns `{ top: 0 }`
- `afterEach` guard sets `document.title` to `"{Page Name} — Plot Twisted"`

### Step 22 — Composable unit tests

- [ ] Create `tests/presentation/composables/use-toast.test.ts`:

- `addToast()` adds a toast to the queue with a unique id
- `removeToast(id)` removes the toast from the queue
- Auto-dismiss removes the toast after timeout (~4s, use `vi.useFakeTimers()`)
- Toast types: `'error'`, `'success'`, `'info'`
- Optional action object is preserved on the toast

- [ ] Create `tests/presentation/composables/use-modal.test.ts`:

- `open(props)` sets `isOpen` to true and stores props
- `close()` sets `isOpen` to false and clears props
- Props include `title`, optional `content`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`

### Step 23 — UI primitive component tests

- [ ] Create `tests/presentation/components/common/empty-state.test.ts`:

- Renders title and description text
- Renders icon when provided
- Does not render icon when omitted

- [ ] Create `tests/presentation/components/common/skeleton-loader.test.ts`:

- Renders with default dimensions
- Applies custom `width`, `height`, and `rounded` props

- [ ] Create `tests/presentation/components/common/toast-container.test.ts`:

- Renders nothing when toast queue is empty
- Renders toast items when toasts exist
- Each toast shows message, dismiss button, and type-colored border
- Optional action button renders when toast has an action

- [ ] Create `tests/presentation/components/common/modal-dialog.test.ts`:

- Does not render when `isOpen` is false
- Renders title, body, confirm, and cancel buttons when open
- Calls `close()` on backdrop click
- Calls `close()` on Escape key

- [ ] Create `tests/presentation/components/error/error-boundary.test.ts`:

- Renders slot content in normal state
- Shows fallback UI with error title, description, and reload button when an error is captured

### Step 24 — Navigation component tests

- [ ] Create `tests/presentation/components/layout/sidebar-nav.test.ts`:

- Renders all 5 nav items with correct icons and translated labels
- Active route item has teal accent classes (`border-accent`, `bg-accent/10`)
- Inactive items have muted classes (`text-slate-400`)
- Home route uses exact match (`route.path === '/'`)

- [ ] Create `tests/presentation/components/layout/bottom-nav.test.ts`:

- Renders all 5 nav items with icons and labels
- Active route item has teal accent styling
- Inactive items have muted styling

### Step 25 — Placeholder view tests

- [ ] Create one test file per view in `tests/presentation/views/`:

| Test File                  | Verifies                                                          |
| :------------------------- | :---------------------------------------------------------------- |
| `home-screen.test.ts`      | Renders `<EmptyState>` with `Home` icon and `page.home.title`     |
| `library-screen.test.ts`   | Renders `<EmptyState>` with `BookMarked` icon and `page.library.title`  |
| `stats-screen.test.ts`     | Renders `<EmptyState>` with `BarChart3` icon and `page.stats.title`    |
| `calendar-screen.test.ts`  | Renders `<EmptyState>` with `CalendarDays` icon and `page.calendar.title` |
| `settings-screen.test.ts`  | Renders `<EmptyState>` with `Settings` icon and `page.settings.title`  |

---

## Phase 10 — Verification

### Step 26 — Verify

- [ ] Run and confirm all pass:
  - `npm run test` — zero test failures
  - `npm run type-check` — zero TypeScript errors
  - `npm run lint` — zero ESLint errors
  - `npm run format:check` — zero formatting issues
  - `npm run build` — production build succeeds
  - `npm run check` — full pipeline passes
  - `npm run dev` — manual verification:
    - Desktop: sidebar visible with 5 nav items, navigation works
    - Mobile (< 768px): sidebar hidden, bottom nav visible, navigation works
    - Active route highlighted in teal in both nav components
    - Page header updates on navigation
    - Document title updates (e.g., "Library — Plot Twisted")
    - Route fade transition visible
    - Scroll resets to top on navigation
    - `/nonexistent` redirects to `/`
