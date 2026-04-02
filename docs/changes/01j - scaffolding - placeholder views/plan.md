# Implementation Plan: Placeholder Views

---

### Step 1 — Write view tests

- [ ] Add one component test file per existing placeholder view in `tests/presentation/views/` before changing the implementations.

| Test File                 | Covers                 | Verifies                                                                                                                           |
| :------------------------ | :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `home-screen.test.ts`     | `SC-20-01`, `SC-26-01` | `/` renders the `House` icon, translated `page.home.title`, and `common.empty.description` in the active locale                    |
| `calendar-screen.test.ts` | `SC-20-01`, `SC-26-01` | `/calendar` renders the `CalendarDays` icon, translated `page.calendar.title`, and `common.empty.description` in the active locale |
| `library-screen.test.ts`  | `SC-20-01`, `SC-26-01` | `/library` renders the `Bookmark` icon, translated `page.library.title`, and `common.empty.description` in the active locale       |
| `settings-screen.test.ts` | `SC-20-01`, `SC-26-01` | `/settings` renders the `Settings` icon, translated `page.settings.title`, and `common.empty.description` in the active locale     |

- [ ] Run the targeted view tests and confirm they fail against the current stub implementations before editing the view files:

  `npm run test -- tests/presentation/views/home-screen.test.ts tests/presentation/views/calendar-screen.test.ts tests/presentation/views/library-screen.test.ts tests/presentation/views/settings-screen.test.ts`

---

### Step 2 — Update placeholder views

- [ ] Update the existing placeholder view SFCs in `src/presentation/views/` to replace the current `<div>` stubs with `EmptyState`-based implementations:

| File                  | Icon Import    | Title Key             | Description Key            |
| :-------------------- | :------------- | :-------------------- | :------------------------- |
| `home-screen.vue`     | `House`        | `page.home.title`     | `common.empty.description` |
| `calendar-screen.vue` | `CalendarDays` | `page.calendar.title` | `common.empty.description` |
| `library-screen.vue`  | `Bookmark`     | `page.library.title`  | `common.empty.description` |
| `settings-screen.vue` | `Settings`     | `page.settings.title` | `common.empty.description` |

Each view follows the same pattern: `<script setup lang="ts">` imports `EmptyState`, the mapped lucide icon, and `useI18n`. The template renders `<EmptyState>` with the icon, the translated heading from `page.*.title`, and the shared supporting text from `common.empty.description`.

---

### Step 3 — Verify the completed change

- [ ] Re-run the targeted placeholder view tests and expect all `SC-20-01` and `SC-26-01` cases to pass:

  `npm run test -- tests/presentation/views/home-screen.test.ts tests/presentation/views/calendar-screen.test.ts tests/presentation/views/library-screen.test.ts tests/presentation/views/settings-screen.test.ts`

- [ ] Run the full automated test suite after the targeted view tests pass:

  `npm run test`

- [ ] Run static type-checking after the view updates:

  `npm run type-check`
