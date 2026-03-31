# Implementation: App Scaffolding — Error Handling

## Overview

Implemented SC-18, SC-19, and SC-24 by adding a presentation-layer `ErrorBoundary` component and wiring it into the root app entry flow. The boundary now catches descendant Vue render/setup errors, replaces the routed content with a full-screen translated fallback UI, and exposes a reload action for crash recovery.

The bootstrap path in `src/main.ts` now registers `app.config.errorHandler` so uncaught Vue component/render errors outside the boundary are logged to `console.error` and dispatched into the shared toast queue with `i18n.global.t('toast.error')`. The implementation followed the plan's test-first order: targeted Vitest coverage was written first, then the component and bootstrap code were added, followed by formatting, linting, compilation, and full test verification.

## Files Changed

### Created

- `src/presentation/components/error/error-boundary.vue` — Error boundary component with translated fallback UI, `role="alert"`, and reload handling.
- `tests/presentation/components/error/error-boundary.test.ts` — Component tests for normal rendering, fallback UI, reload behavior, and propagation suppression.
- `tests/main.test.ts` — Bootstrap test that captures `app.config.errorHandler` and verifies console logging plus toast dispatch.
- `docs/changes/01h - scaffolding - error handling/implementation.md` — Implementation record for this feature.

### Modified

- `src/main.ts` — Registers the global Vue error handler and dispatches translated error toasts through `useToast()`.
- `src/App.vue` — Wraps routed application content in `ErrorBoundary` so crashes surface the fallback UI.
- `docs/changes/01h - scaffolding - error handling/requirements.md` — Advanced feature status from `approved` to `under_test`.
- `docs/changes/01h - scaffolding - error handling/plan.md` — Checked off implementation and verification steps after execution.
- `docs/changes/01h - scaffolding - error handling/index.md` — Added the implementation entry.

## Key Decisions

- `src/main.ts` continues to use the documented layer exception by importing `useToast()` and `i18n` directly so the global handler works outside component `setup()`.
- `ErrorBoundary` returns `false` from `onErrorCaptured`, which prevents propagation to the global handler and avoids double-handling crashes that already show the fallback UI.
- `ErrorBoundary` accepts an optional `reloadPage` callback with a production default of `window.location.reload()` so the required reload behavior remains testable in jsdom without changing runtime behavior.
- Rollback strategy: remove `app.config.errorHandler` from `src/main.ts`, unwrap `src/App.vue` from `ErrorBoundary`, and delete the new component/tests to restore the previous scaffold.

## Deviations from Plan

- `src/App.vue` was updated in addition to the plan's listed files because the existing root component was blank and the architecture requires the router outlet to live inside the global error boundary. This scope addition was explicitly approved before implementation.
- The verification items for fallback rendering and toast dispatch were satisfied through the new automated tests instead of a separate manual browser check.

## Testing

- `tests/presentation/components/error/error-boundary.test.ts` covers SC-24-03, SC-18-01, SC-18-02, SC-18-03, and NFR-01h-02.
- `tests/main.test.ts` covers SC-19-01 by importing `src/main.ts`, capturing the production `app.config.errorHandler`, and asserting toast queue updates.
- Verification results summary:
  - `npm run format` — PASS
  - `npm run type-check` — PASS
  - `npm test` — PASS (11 files, 100 tests)
  - `npm run lint` — PASS
  - `npm run type-check` — PASS

## Dependencies

- No new dependencies.
