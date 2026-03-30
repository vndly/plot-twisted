---
id: R-01g
title: App Scaffolding — Toast Container & Modal Dialog
status: approved
type: infrastructure
importance: critical
tags: [components, toast, modal, overlay]
---

## Intent

Create the ToastContainer and ModalDialog overlay components that render the toast queue and modal state managed by the composables from 01e.

## Context & Background

### Dependencies

- **01a** — Test infrastructure (vitest config, setup file, `@vue/test-utils`).
- **01c** — Theme colors for type-colored borders (`--color-success`, `--color-error`) and transition CSS classes (`toast-*`, `modal-*`).
- **01e** — `useToast` and `useModal` composables.

## Decisions

None specific to this sub-phase (composable decision was in 01e).

## Scope

### In Scope

- Create `src/presentation/components/common/toast-container.vue` (consumes `toast-*` CSS transition classes from 01c).
- Create `src/presentation/components/common/modal-dialog.vue` (consumes `modal-*` CSS transition classes from 01c).
- Write component tests: `tests/presentation/components/common/toast-container.test.ts` and `tests/presentation/components/common/modal-dialog.test.ts`.

### Out of Scope

- Composable logic (managed by 01e).
- Transition CSS classes (delivered by 01c).
- Toast/modal integration into App.vue (handled by 01k).

## Functional Requirements

| ID    | Requirement                  | Description                                                                                                                                                                                                                                                                                                                                                                                     | Priority |
| :---- | :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| SC-14 | Toast container              | Fixed top-right container (`z-50`) rendering the toast queue with `<TransitionGroup>` using the `toast-*` CSS transition classes (300 ms slide-in from the right, 200 ms fade-out on dismiss). Each toast has a dismiss button and an optional action button (text-style, positioned left of the dismiss button). Maximum 5 simultaneous toasts; when exceeded, the oldest toast is evicted.    | P0       |
| SC-15 | Modal/dialog                 | `modal-dialog.vue` with backdrop (`bg-black/50`), centered content card, title, optional content, confirm/cancel buttons. Escape key listener registered on `document` when the modal is open, removed on close. Confirm defaults to `$t('modal.confirm')`, cancel defaults to `$t('modal.cancel')` when labels are not provided. Opening a new modal while one is active replaces the current. | P1       |
| SC-24 | UI primitive tests (partial) | Component tests for ToastContainer (SC-24-04: renders toast queue, dismiss, positioning) and ModalDialog (SC-24-05: renders title/content/buttons, closes on backdrop click and Escape). Remaining SC-24 coverage (ErrorBoundary) is in R-01h.                                                                                                                                                  | P0       |

## Non-Functional Requirements

### Stacking Order

Overlay elements introduced by this feature use the following z-index scale. Navigation component z-indices are defined in R-01i.

- Modal backdrop: `z-40`
- Modal content card: `z-40` (same layer as backdrop; stacks above via DOM order)
- Toast container: `z-50` (renders above modals — toasts remain visible when a modal is open)

### Accessibility

- Toast and modal transitions must respect `prefers-reduced-motion` by setting transition duration to 0ms when the user preference is `reduce`.

## Risks & Assumptions

### Assumptions

- `useToast` and `useModal` composables are implemented and tested (01e dependency).
- Transition CSS classes (`toast-*`, `modal-*`) exist in `main.css` (delivered in 01c).
- No accessibility focus trapping is required for the modal (per ui-ux.md § 11: minimal scope).

## Acceptance Criteria

- [ ] Toast container is fixed top-right with `z-50` (SC-14)
- [ ] Toasts stack vertically (flex column, `gap-3`) without overlapping (SC-14)
- [ ] Each toast has a dismiss button; clicking it removes the toast (SC-14)
- [ ] Toasts display type-colored left borders (error -> `--color-error`, success -> `--color-success`, info -> `--color-accent`) (SC-14)
- [ ] Toast enter/leave uses `<TransitionGroup>` animation (300 ms slide-in, 200 ms fade-out) (SC-14)
- [ ] When toast queue exceeds 5, oldest toast is evicted (SC-14)
- [ ] Optional action button renders left of dismiss button and invokes callback when clicked (SC-14)
- [ ] Toast and modal transitions are disabled when `prefers-reduced-motion: reduce` is active (SC-14, SC-15)
- [ ] Modal renders backdrop overlay (`bg-black/50`) and centered content card (SC-15)
- [ ] Modal displays title, optional content (hidden when not provided), confirm and cancel buttons (SC-15)
- [ ] Modal closes on backdrop click (SC-15)
- [ ] Modal closes on Escape key (document-level listener) (SC-15)
- [ ] Confirm button invokes `onConfirm` callback and closes the modal (SC-15)
- [ ] Cancel button invokes `onCancel` callback and closes the modal (SC-15)
- [ ] Opening a new modal replaces any currently active modal (SC-15)
- [ ] Component tests for ToastContainer pass (SC-24)
- [ ] Component tests for ModalDialog pass (SC-24)
