# Implementation: User Settings & Data Management

## Overview

Implemented a comprehensive User Settings screen and robust Data Management functionality. This feature allows users to customize their experience (theme, layout, language, region) and ensures data portability through JSON import and export with merge and overwrite strategies.

## Files Changed

### Created

- `tests/infrastructure/storage.service.import-export.test.ts` — Verification for data portability logic.
- `tests/application/use-settings.test.ts` — Verification for settings business logic.
- `src/presentation/components/settings/ThemeToggle.vue` — Animated toggle for light/dark modes.
- `src/presentation/components/settings/LayoutModeToggle.vue` — Toggle for grid/list views.
- `src/presentation/components/settings/SettingsSelect.vue` — Custom dropdown for language, region, and home section.
- `src/presentation/components/settings/SettingsRow.vue` — Layout component for settings entries.

### Modified

- `src/domain/settings.schema.ts` — Added `ExportDataSchema` and `ImportDataSchema` with Zod validation.
- `src/infrastructure/storage.service.ts` — Implemented `exportData`, `importData`, sanitization, and safety backup triggers.
- `src/application/use-settings.ts` — Converted to a singleton reactive state to ensure cross-component synchronization; exposed import/export methods.
- `src/presentation/views/settings-screen.vue` — Fully implemented the settings UI with sections and confirmation dialogs.
- `src/presentation/i18n/locales/*.json` — Added comprehensive localized strings for all new settings and sections.

## Key Decisions

- **Singleton Pattern for Settings**: Switched `useSettings` to a singleton pattern with module-level refs. This ensures that when a user changes the language or theme in Settings, all other active components (Home, Library) update immediately without requiring a page reload or remount.
- **Safety Export**: Implemented an automatic download of the current library before any "Overwrite" import to prevent accidental data loss.
- **Sanitization on Import**: All user-provided strings in imported JSON are stripped of HTML tags and trimmed to prevent XSS.

## Deviations from Plan

- **Singleton Refactoring**: Added singleton behavior to `useSettings` which was not explicitly detailed in the plan but was necessary to fulfill the requirement of "updating views immediately".
- **i18n Key Naming**: Used snake_case for some nested settings keys to maintain consistency with the existing `modal` and `library` keys in the locale files.

## Testing

- **Infrastructure**: Unit tests for `exportData` (record conversion, tag extraction) and `importData` (validation, sanitization, strategy application).
- **Application**: Integration tests for `useSettings` reactivity and method exposure.
- **Presentation**: View tests for `settings-screen.vue` verifying section rendering and component composition.
- **Manual Verification**:
  - Export generates valid JSON with correct versions.
  - Overwrite import triggers safety backup download.
  - Merge import successfully unions library entries.
  - Theme and Layout changes reflect immediately across the app shell.

## Dependencies

- **lucide-vue-next**: Used for new setting icons (Sun, Moon, LayoutGrid, List, etc.).
- **zod**: Used for robust import validation and future schema migrations.
- **vue-i18n**: Full localization support for all UI elements.
