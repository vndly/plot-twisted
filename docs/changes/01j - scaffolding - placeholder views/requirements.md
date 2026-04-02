---
id: R-01j
title: App Scaffolding — Placeholder Views
status: approved
type: infrastructure
importance: high
tags: [views, placeholder]
---

## Intent

Update the 4 existing route placeholder view components so each route displays an `EmptyState` with its mapped icon, translated page title, and shared translated supporting text.

## Prerequisites

- **01b** — i18n keys for page titles and empty description
- **01f** — EmptyState component

## Scope

### In Scope

- Update the existing `home-screen.vue`, `calendar-screen.vue`, `library-screen.vue`, and `settings-screen.vue` files in `src/presentation/views/` to replace the current stub placeholders
- Write component tests for each placeholder view in `tests/presentation/views/`

### Out of Scope

- App shell assembly in `App.vue` or `app-shell.vue`
- Routing, navigation, or route metadata changes owned by earlier scaffolding work
- Final shell verification owned by `01k`

## Functional Requirements

| ID    | Requirement            | Description                                                                                                                                                                                                                                                                    | Priority |
| :---- | :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-20 | Placeholder views      | 4 view components (one per route) update the existing stub views to render `<EmptyState>` with the mapped lucide icon (`House`, `CalendarDays`, `Bookmark`, `Settings`), the translated `page.*.title` heading, and the translated `common.empty.description` supporting text. | P0       |
| SC-26 | Placeholder view tests | Each of the 4 view component tests verifies the placeholder view renders the mapped icon, translated `page.*.title` heading, and shared `common.empty.description` supporting text.                                                                                            | P1       |

## Non-Functional Requirements

### Implementation Consistency

- **NFR-01j-01 (SFC block order):** All 4 placeholder view SFCs use `<script setup lang="ts">` followed by `<template>`, with no local `<style>` block added in this change.
- **NFR-01j-02 (Localization):** All user-facing placeholder text in the 4 view files is sourced from `page.*.title` and `common.empty.description`, with zero hardcoded locale-specific strings in the view implementations.

## Acceptance Criteria

- [ ] `SC-20` — Each route view renders `EmptyState` with the mapped lucide icon, the translated `page.*.title` heading, and the translated `common.empty.description` supporting text.
- [ ] `SC-26` — Component tests cover all 4 route views and verify the mapped icon, translated title, and shared description.
- [ ] `NFR-01j-01` — The 4 placeholder view SFCs follow the required block order and do not add a local `<style>` block.
- [ ] `NFR-01j-02` — The 4 placeholder view implementations contain no hardcoded user-facing strings.
