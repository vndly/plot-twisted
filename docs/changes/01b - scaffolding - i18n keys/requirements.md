---
id: R-01b
title: App Scaffolding — i18n Keys
status: draft
type: infrastructure
importance: critical
tags: [i18n, localization]
---

## Intent

Add all i18n keys needed by the scaffolding phases (navigation labels, page titles, empty state text, error text, toast labels) to all three locale files.

## Context & Background

### Dependencies

- [Phase 00 (Setup)](../../product/00%20-%20setup/) complete — vue-i18n installed, locale files exist with `app.title` key.

## Decisions

| Decision                          | Choice                                                | Rationale                                                                                                                                                                                                             |
| :-------------------------------- | :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Namespace pattern for shared keys | `common.*` (e.g., `common.error.*`, `common.empty.*`) | Distinguishes global reusable strings from feature-scoped keys (e.g., `library.empty.title`). Keeps shared error and empty state text under a single top-level namespace rather than scattering across feature areas. |

## Scope

### In Scope

- Add `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*` keys to `en.json`, `es.json`, `fr.json`.
- Verify that vue-i18n fallback to English works correctly for the scaffolded keys.

### Out of Scope

- Vue component creation or modification.
- vue-i18n instance configuration or locale switching logic (fallback verification for scaffolded keys is in scope).
- i18n keys beyond the scaffolding namespaces listed above (e.g., `library.*`, `details.*`).

## Functional Requirements

| ID    | Requirement | Description                                                                                                                                                                                                                                                                                                                                                                                                             | Priority |
| :---- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-12 | i18n keys   | Add 18 i18n keys across 5 namespaces to `en.json`, `es.json`, `fr.json`: **nav** — `home`, `recommendations`, `calendar`, `library`, `settings`; **page.\*.title** — `home`, `recommendations`, `calendar`, `library`, `settings`; **common.empty** — `title`, `description`; **common.error** — `title`, `description`, `reload`; **toast** — `error`, `dismiss`, `retry`. Existing `app.title` key must be preserved. | P0       |

## Non-Functional Requirements

### Key Structure Compliance

- **camelCase nesting:** Every key segment in all locale JSON files must be a camelCase identifier (matching `^[a-z][a-zA-Z0-9]*$`). Verified by a unit test in `tests/presentation/i18n/locale-keys.test.ts` per [conventions.md Section 11](../../technical/conventions.md#11-internationalization-i18n).

## Risks & Assumptions

### Assumptions

- Phase 00 (Setup) is complete: vue-i18n is installed, `src/presentation/i18n/index.ts` exists, and all three locale files contain the `app.title` key.
- Spanish and French translations use standard UI terminology; native speaker review is deferred to a later phase.

### Risks

- **Translation accuracy** (low likelihood, low impact): Translations cannot be verified in context until downstream features (01i, 01j) render the keys in UI components. Mitigation: translations use standard, well-known UI terms.

## Acceptance Criteria

- [ ] All three locale files (`en.json`, `es.json`, `fr.json`) contain the new key namespaces: `nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*`
- [ ] All three files have identical key paths
- [ ] All translation values are non-empty strings in all three files
- [ ] Existing `app.title` key is preserved in all three files
- [ ] All locale files are valid JSON after modification
- [ ] All key paths follow camelCase nested structure per conventions.md Section 11
