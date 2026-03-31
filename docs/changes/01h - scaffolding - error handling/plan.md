# Implementation Plan: Error Handling

---

## Step 1 — Write error-boundary tests

- [x] Create `tests/presentation/components/error/error-boundary.test.ts` covering:

- **SC-24-03** — Renders slot content in normal state
- **SC-18-01 / SC-24-06** — Shows the full-screen fallback UI with translated error title, description, primary reload button, and `role="alert"` when an error is captured
- **SC-18-02** — Reload button calls `window.location.reload()`
- **SC-18-03** — `onErrorCaptured` returns `false` to prevent propagation to the global error handler, so no error toast is dispatched

---

## Step 2 — Write global error handler test

- [x] Create `tests/main.test.ts` covering:

- **SC-19-01** — `app.config.errorHandler` dispatches an error toast to the shared queue via `useToast()` and logs to `console.error`

  **Setup:** Mock `createApp()` to capture the production `app.config.errorHandler` assigned during `src/main.ts` module initialization, then invoke that captured handler with a synthetic error. Use `vi.spyOn(console, 'error')` to verify logging. Assert that `useToast().toasts.value` contains a newly queued toast with `message: i18n.global.t('toast.error')` and `type: 'error'`. Call `_resetForTesting()` in `beforeEach` for test isolation.

---

## Step 3 — Create error boundary

- [x] Create `src/presentation/components/error/error-boundary.vue`:

- Uses `onErrorCaptured` lifecycle hook
- Returns `false` from `onErrorCaptured` to prevent propagation to global error handler
- Normal state: renders `<slot />`
- Error state: full-screen centered fallback with `$t('common.error.title')`, `$t('common.error.description')`, and a primary reload button calling `window.location.reload()`
- Fallback container uses `role="alert"` for accessibility as an intentional exception to the default semantic-only guidance
- Style fallback UI with Tailwind classes consistent with the global error-state guidance in `docs/technical/ui-ux.md`

---

## Step 4 — Add global error handler

- [x] Modify `src/main.ts` to add `app.config.errorHandler` (after existing plugin registrations):

- Import `useToast` from `./presentation/composables/use-toast`
- Import `i18n` from `./presentation/i18n`
- Logs uncaught component/render errors to `console.error`
- Calls `useToast().addToast({ message: i18n.global.t('toast.error'), type: 'error' })` for errors not already handled by the ErrorBoundary
- Leaves API request failures on their existing request-specific error paths

> Note: `main.ts` importing from `src/presentation/composables/` is an intentional exception to typical layer boundaries, consistent with the module-level singleton decision in requirements. The `i18n.global.t()` function is used because the handler runs outside Vue component lifecycle.

---

## Step 5 — Verification

- [x] Run `npm test` to verify all tests pass
- [x] Run `npm run lint` to verify no linting errors
- [x] Run `npm run type-check` to verify no type errors
- [x] Verify the error boundary renders the documented full-screen fallback when a child throws
- [x] Verify the global error handler dispatches a `toast.error` entry to the shared toast queue for uncaught component/render errors outside the ErrorBoundary
