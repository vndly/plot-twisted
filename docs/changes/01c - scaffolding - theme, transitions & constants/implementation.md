# Implementation: App Scaffolding — Theme, Transitions & Constants

## Overview

This implementation adds the visual foundation layer for the application: Tailwind theme color tokens for success/error states, Vue `<Transition>` CSS classes for route fades, toast notifications, and modal dialogs, a `prefers-reduced-motion` override for accessibility, and the `TOAST_DISMISS_MS` domain constant. All CSS is centralized in `src/assets/main.css` as an acknowledged exception to the Tailwind-only rule, since Vue's `<Transition>` component requires class-based CSS.

## Files Changed

### Created

- `src/domain/constants.ts` — Exports `TOAST_DISMISS_MS = 4000`, the auto-dismiss timeout for toast notifications. Located in the Domain layer as a pure TypeScript constant consumed by downstream composables (R-01e) and components (R-01g).
- `tests/domain/constants.test.ts` — Unit tests verifying `TOAST_DISMISS_MS` is exported with value `4000` and is of type `number`.

### Modified

- `src/assets/main.css` — Added `--color-success: #22c55e` and `--color-error: #ef4444` to the existing `@theme` block. Added `.fade-*` transition classes (200ms opacity, ease-in-out), `.toast-*` transition classes (300ms enter with translateX slide + opacity, 200ms leave fade), `.modal-*` transition classes (200ms enter with scale + opacity, 150ms leave), and a `@media (prefers-reduced-motion: reduce)` block disabling all transitions and `animate-pulse` animation.
- `tsconfig.vitest.json` — Added `src/**/*` and `src/**/*.vue` to the `include` array so that test files can import source modules without TypeScript project boundary errors.

## Key Decisions

- **Theme colors appended to existing `@theme` block**: Kept all theme tokens in a single block rather than creating a separate one, maintaining the existing pattern established in R-00.
- **Modal leave duration at 150ms**: Intentionally below the UI/UX spec's 200–300ms guideline for a snappier leave feel, as documented in NFR-01c-05.

## Deviations from Plan

- **tsconfig.vitest.json fix**: The vitest TypeScript config only included `tests/**/*.ts` in its `include` array, which meant source files imported by tests were outside the project boundary. Added `src/**/*` and `src/**/*.vue` to fix TS error 6307. This was a pre-existing config issue that surfaced when the first test importing from `src/` was introduced.

## Testing

- `tests/domain/constants.test.ts` — 2 tests covering SC-01c-25-01: value assertion (`4000`) and type assertion (`number`). Both pass.
- CSS structural verification performed manually against `src/assets/main.css` content: all theme tokens, transition classes, and reduced-motion overrides confirmed present and correct.
- Behavioral scenarios (SC-01c-22-02, SC-01c-22-03, SC-01c-23-02, SC-01c-24-01 through SC-01c-24-03) are deferred to R-01g and R-01k integration testing, as they require the toast component, modal component, and app shell wiring that those phases deliver.

## Verification Results

- `npx vitest run` — PASS (2 files, 8 tests)
- `npm run check` — PASS (format, lint, type-check, test, build all clean)

## Dependencies

No new dependencies.

## Requirement Coverage

| Requirement                  | Implementation                                                                              |
| :--------------------------- | :------------------------------------------------------------------------------------------ |
| SC-01c-21 (Theme additions)  | `--color-success` and `--color-error` added to `@theme` block in `src/assets/main.css:9-10` |
| SC-01c-09a (Fade transition) | `.fade-*` classes at `src/assets/main.css:13-21`                                            |
| SC-01c-22 (Toast transition) | `.toast-*` classes at `src/assets/main.css:23-37`                                           |
| SC-01c-23 (Modal transition) | `.modal-*` classes at `src/assets/main.css:39-53`                                           |
| SC-01c-24 (Reduced-motion)   | `@media (prefers-reduced-motion: reduce)` block at `src/assets/main.css:55-68`              |
| SC-01c-25 (Domain constants) | `TOAST_DISMISS_MS` exported from `src/domain/constants.ts:2`                                |

## Known Limitations

- Theme colors target the dark theme only; light-theme counterparts are deferred to a future theme-switching feature phase.
- Behavioral verification of transitions requires downstream components (R-01g, R-01k) and is deferred to those phases.
