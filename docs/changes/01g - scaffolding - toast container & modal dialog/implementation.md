# Implementation: App Scaffolding — Toast Container & Modal Dialog

## Overview

This implementation delivers two overlay UI components: `ToastContainer` and `ModalDialog`. Both components consume reactive state from composables delivered in 01e (`useToast` and `useModal`) and render using Vue's built-in `<Transition>` and `<TransitionGroup>` components with CSS transition classes from 01c.

The toast container renders a queue of notifications in the top-right corner with type-colored borders, dismiss buttons, and optional action buttons. The modal dialog renders a centered confirmation dialog with backdrop overlay, title, optional content, and confirm/cancel buttons with i18n-driven default labels.

## Files Changed

### Created

- `src/presentation/components/common/toast-container.vue` — Fixed top-right container (`z-50`) rendering the toast queue with `<TransitionGroup name="toast">`. Each toast displays a type-colored left border (`border-l-error`, `border-l-success`, `border-l-accent`), message text, optional action button, and dismiss button with X icon from lucide-vue-next.

- `src/presentation/components/common/modal-dialog.vue` — Modal overlay component with backdrop (`fixed inset-0 z-40 bg-black/50`) and centered content card. Uses `<Transition name="modal">` for enter/leave animations. Escape key listener is registered/unregistered via `watch` on `isOpen` state to avoid stale listeners.

- `tests/presentation/components/common/toast-container.test.ts` — Component test suite covering SC-14 scenarios: container positioning, toast stacking, dismiss button, type-colored borders, transition classes, auto-dismiss timing, i18n labels, and action button callbacks.

- `tests/presentation/components/common/modal-dialog.test.ts` — Component test suite covering SC-15 scenarios: backdrop click close, Escape key close, confirm/cancel callbacks, modal replacement, transition classes, i18n labels, and content card click propagation stop.

### Modified

- `src/presentation/i18n/locales/en.json` — Added `modal.confirm` and `modal.cancel` keys for default button labels.

- `src/presentation/i18n/locales/es.json` — Added Spanish translations: `modal.confirm: "Confirmar"`, `modal.cancel: "Cancelar"`.

- `src/presentation/i18n/locales/fr.json` — Added French translations: `modal.confirm: "Confirmer"`, `modal.cancel: "Annuler"`.

- `tests/presentation/i18n/locale-keys.test.ts` — Updated `EXPECTED_KEYS` array to include `modal.confirm` and `modal.cancel`; updated test description to reflect 21 keys.

## Key Decisions

- **Escape key handling via watch**: The modal registers and unregisters the document-level `keydown` listener using a `watch` on `isOpen` state, ensuring the listener is properly cleaned up when the modal closes and avoiding stale listener issues when the modal reopens.

- **Click propagation stop on content card**: The modal content card uses `@click.stop` to prevent clicks inside the card from bubbling to the backdrop. The backdrop uses `@click.self="close"` to only respond to direct clicks on itself.

- **Type-to-border-class mapping function**: Toast border colors are mapped via a `getBorderClass` function that returns Tailwind classes (`border-l-error`, `border-l-success`, `border-l-accent`) rather than inline styles, maintaining Tailwind-only styling convention.

- **Minimum touch targets**: Both dismiss and action buttons on toasts, as well as modal buttons, use `min-h-11` (44px) to meet the 44×44px touch target requirement from ui-ux.md § 11.

## Deviations from Plan

None — implementation followed the plan exactly.

## Testing

### Test Files

- `tests/presentation/components/common/toast-container.test.ts` — 18 tests covering all SC-14 scenarios plus implementation details (empty state, keying, action button presence).

- `tests/presentation/components/common/modal-dialog.test.ts` — 18 tests covering all SC-15 scenarios plus additional edge cases (optional callbacks, listener cleanup).

### Coverage

- **Toast container**: Queue rendering, positioning (fixed top-4 right-4 z-50), stacking (flex-col gap-3), dismiss functionality, auto-dismiss timer, type-colored borders, TransitionGroup presence, i18n labels, action button callbacks.

- **Modal dialog**: Open/close states, backdrop click close, Escape key close, confirm/cancel callbacks, modal replacement, Transition presence, content card click stop propagation, optional content rendering, custom button labels, default i18n labels.

### Verification Results

- `npm run type-check` — PASS (zero errors)
- `npm run test` — PASS (95 tests passing)

## Dependencies

No new dependencies. Components use existing dependencies:

- `vue-i18n` (already installed) — for `useI18n()` and `$t()` translations
- `lucide-vue-next` (already installed) — for X icon on dismiss button

## Traceability

| Requirement             | Implementation                                                                                                                                                                                                    |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SC-14 (Toast container) | `toast-container.vue` — fixed top-right positioning, z-50, TransitionGroup with `toast-*` classes, type-colored borders, dismiss button with X icon, optional action button, max 5 toasts (handled by composable) |
| SC-15 (Modal/dialog)    | `modal-dialog.vue` — backdrop with `bg-black/50`, centered content card, Escape key listener, confirm/cancel buttons with i18n defaults, `@click.stop` on content card                                            |
| SC-24-04 (Toast tests)  | `toast-container.test.ts` exists and passes                                                                                                                                                                       |
| SC-24-05 (Modal tests)  | `modal-dialog.test.ts` exists and passes                                                                                                                                                                          |

## Known Limitations

- **Accessibility**: Per ui-ux.md § 11, no focus trapping is implemented for the modal. Focus remains on the element that triggered the modal.

- **Reduced motion**: Transition disabling for `prefers-reduced-motion` is handled entirely by CSS media queries in `main.css`. The components do not programmatically detect or respond to motion preferences.

- **Integration**: These components are not yet integrated into `App.vue`. That integration is handled by R-01k (App Shell & Assembly).
