# Implementation: App Scaffolding — i18n Keys

## Overview

Added 18 i18n keys across 5 namespaces (`nav.*`, `page.*.title`, `common.empty.*`, `common.error.*`, `toast.*`) to all three locale files (`en.json`, `es.json`, `fr.json`). The existing `app.title` key was preserved. A test-first approach was used: a locale key parity test was written before the keys were added, confirming the test failed with only the pre-existing `app.title` key, then passed after all 18 keys were added.

## Files Changed

### Created

- `tests/presentation/i18n/locale-keys.test.ts` — Unit test validating locale file structure: key parity across all three locales, non-empty string values, expected 19-key set, `app.title` preservation, and camelCase segment compliance (NFR-01b-01).

### Modified

- `src/presentation/i18n/locales/en.json` — Added 18 English translation keys across 5 namespaces.
- `src/presentation/i18n/locales/es.json` — Added 18 Spanish translation keys across 5 namespaces.
- `src/presentation/i18n/locales/fr.json` — Added 18 French translation keys across 5 namespaces.
- `docs/changes/01b - scaffolding - i18n keys/requirements.md` — Status updated from `approved` to `under_test`.
- `docs/changes/01b - scaffolding - i18n keys/plan.md` — All step checkboxes marked complete.

## Key Decisions

- **Nested JSON structure**: Locale files use nested JSON objects (e.g., `{ "nav": { "home": "Home" } }`) rather than flat dot-notation keys (e.g., `{ "nav.home": "Home" }`). This matches the existing `app.title` structure from Phase 00, the vue-i18n configuration (no `flatJson: true` option), and how `$t('nav.home')` resolves paths in nested message objects.
- **Test uses `fs.readFileSync`**: The test reads locale files directly from disk rather than importing them as modules. This provides explicit file existence validation and avoids potential interference from the `@intlify/unplugin-vue-i18n` Vite plugin that transforms locale files during build.
- **Key path flattening in tests**: A recursive `flattenKeys` helper converts nested JSON to dot-notation paths for assertion, allowing the test to validate key parity and completeness regardless of the JSON nesting depth.

## Deviations from Plan

- **Nested vs flat JSON**: The plan's "Expected flat JSON structure" section showed literal flat dot-notation keys. The implementation uses nested JSON instead, because the existing locale files (from Phase 00) already use nested format and the vue-i18n instance is not configured with `flatJson: true`. The key paths and values are identical — only the JSON structure differs. This is consistent with the project's technical conventions which describe keys as nested by feature area.

## Testing

- **Test file**: `tests/presentation/i18n/locale-keys.test.ts` — 6 test cases covering:
  - File existence and valid JSON parsing (AC5)
  - Identical key paths across all three locales (AC2)
  - Non-empty string values in all locales (AC3)
  - Exactly 19 expected keys present (AC1, AC7)
  - `app.title` preserved with original value (AC4)
  - camelCase segment compliance for all key paths (AC6, NFR-01b-01)
- **Test-first verification**: Tests failed before implementation (1 of 6 failed — "contains exactly the expected 19 keys"), then all 6 passed after locale files were updated.
- **Verification results**: All automated checks passed — vitest, prettier, tsc, build.

## Dependencies

No new dependencies.

## Known Limitations

- **Translation accuracy**: Spanish and French translations use standard UI terminology but have not been reviewed by native speakers. This is noted as a deferred concern in the requirements.
- **Fallback verification (AC9)**: vue-i18n fallback to English is implicitly satisfied by the `fallbackLocale: 'en'` configuration from Phase 00. Explicit runtime fallback testing is deferred to downstream features (01i, 01j) that provide rendering components to exercise the fallback chain.
