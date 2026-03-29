# Implementation Plan: Toast Container & Modal Dialog

---

## Phase 1 — Tests

### Step 1 — Write toast-container tests

- [ ] Create `tests/presentation/components/common/toast-container.test.ts` covering:

- **SC-14-01** — Multiple toasts stack vertically without overlapping
- **SC-14-02** — Container is fixed top-right with `z-50`
- **SC-14-03** — Dismiss button removes toast
- **SC-14-04** — Oldest toast evicted when max (5) exceeded
- **SC-14-05** — Toast enter/leave transitions (slide-in, fade-out)
- **SC-14-06** — Type-colored left borders per toast type
- **SC-14-07** — Toast auto-dismisses after `TOAST_DISMISS_MS`
- **SC-14-08** — Transitions disabled when `prefers-reduced-motion: reduce`
- **SC-14-09** — Toast text renders in non-default locale
- **SC-24-04** — ToastContainer component test suite exists and passes
- `(implementation detail)` — Renders nothing when toast queue is empty; renders toast items when present
- `(implementation detail)` — Each toast shows message, dismiss button, type-colored border, and optional action button (renders when provided, triggers handler on click)
- `(implementation detail)` — Each toast item is keyed by `toast.id` for `<TransitionGroup>`

### Step 2 — Write modal-dialog tests

- [ ] Create `tests/presentation/components/common/modal-dialog.test.ts` covering:

- **SC-15-01** — Opens and renders title, content, confirm, and cancel buttons
- **SC-15-02** — Closes on backdrop click
- **SC-15-03** — Closes on Escape key (document-level listener)
- **SC-15-04** — Confirm button invokes `onConfirm` callback
- **SC-15-05** — Cancel button invokes `onCancel` callback
- **SC-15-06** — Opening a new modal replaces the current one
- **SC-15-07** — Modal open/close transitions (fade backdrop, scale content)
- **SC-15-08** — Modal text renders in non-default locale
- **SC-24-05** — ModalDialog component test suite exists and passes
- `(implementation detail)` — Does not render when `isOpen` is false

---

## Phase 2 — Implementation

### Step 3 — Create toast-container component

- [ ] Create `src/presentation/components/common/toast-container.vue`:

- Fixed `top-4 right-4 z-50`, flex column with `gap-3`
- Uses `useToast()` to read the toast queue
- Each toast item keyed by `toast.id` for correct `<TransitionGroup>` animation
- Each toast: dark surface card, type-colored left border using theme tokens (`--color-error`, `--color-success`, `--color-accent`)
- Dismiss X button + optional action button (text-style, left of dismiss)
- All user-facing text via `$t()` with `toast.*` i18n keys
- `<TransitionGroup>` using `toast-*` CSS transition classes (300 ms enter, 200 ms leave, ease-in-out); transitions disabled when `prefers-reduced-motion: reduce` is active

### Step 4 — Create modal-dialog component

- [ ] Create `src/presentation/components/common/modal-dialog.vue`:

- Uses `useModal()` to read open/close state and props
- Rendered with `v-if` on `isOpen` (no DOM presence when closed)
- Backdrop: `fixed inset-0 z-40 bg-black/50`, click-to-close
- Content card: centered, `bg-surface rounded-lg`
- Title, optional content (from `ModalProps.content`), confirm and cancel buttons
- Confirm defaults to `$t('modal.confirm')`, cancel defaults to `$t('modal.cancel')` when labels not provided
- Escape key listener registered on `document` via `onMounted`/`onUnmounted`
- `<Transition>`: fade backdrop + scale content (200-300 ms, ease-in-out); disabled when `prefers-reduced-motion: reduce` is active

---

## Phase 3 — Verification

### Step 5 — Verify

- [ ] Run `npm run type-check` — zero errors
- [ ] Run `npm run test` — all tests pass
- [ ] Confirm all acceptance criteria in `requirements.md` are met
