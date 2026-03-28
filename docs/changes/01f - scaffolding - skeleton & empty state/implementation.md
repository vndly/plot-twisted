# Implementation: Skeleton & Empty State

## Overview

Created two reusable UI primitives — `SkeletonLoader` and `EmptyState` — in the Presentation layer's `common/` directory, following a test-first approach. Both components are stateless, translation-agnostic primitives that receive all content via props. Tests were written first (Phase 1), components implemented to satisfy them (Phase 2), and all verification checks passed (Phase 3).

## Files Changed

### Created

- `src/presentation/components/common/skeleton-loader.vue` — Shimmer placeholder with configurable `width`, `height`, and `rounded` props. Renders a single `<div>` with `animate-pulse bg-surface` and `aria-hidden="true"`.
- `src/presentation/components/common/empty-state.vue` — Centered empty state layout with optional icon (dynamic `<component :is>`), required title, optional description, and optional CTA button. CTA renders only when both `ctaLabel` and `ctaAction` are provided.
- `tests/presentation/components/common/skeleton-loader.test.ts` — 3 tests covering SC-17-01, SC-17-02, SC-17-03, and SC-24-02.
- `tests/presentation/components/common/empty-state.test.ts` — 7 tests covering SC-16-01 through SC-16-06, SC-24-01, and the implementation-detail case (ctaAction without ctaLabel).

### Modified

- `docs/changes/01f - scaffolding - skeleton & empty state/requirements.md` — Status updated from `approved` to `under_test`.
- `docs/changes/01f - scaffolding - skeleton & empty state/plan.md` — All step checkboxes marked `[x]`.

## Key Decisions

- **SkeletonLoader dimensions via inline style**: Used `:style="{ width, height }"` for dimensions since these are arbitrary user-provided values, not Tailwind utility classes. The `rounded` prop is applied via `:class` since it receives Tailwind class strings.
- **EmptyState CTA guard**: Button renders only when both `ctaLabel` and `ctaAction` are truthy (`v-if="ctaLabel && ctaAction"`), matching requirements that a label without an action or an action without a label should not show a button.
- **Optional prop defaults**: All optional props default to `undefined` rather than empty strings or no-ops, keeping the component's conditional rendering clean with simple truthiness checks.
- **Icon rendering**: Used Vue's dynamic `<component :is="icon">` for the icon prop, allowing consumers to pass any Vue component (e.g., lucide-vue-next icons).

## Deviations from Plan

None — implementation followed the plan exactly.

## Testing

- **`skeleton-loader.test.ts`** (3 tests): Verifies specified dimensions with pulse animation and `aria-hidden`, custom `rounded` prop, and default prop values. Covers SC-17-01, SC-17-02, SC-17-03, SC-24-02.
- **`empty-state.test.ts`** (7 tests): Verifies full props rendering (icon, title, description), title-only rendering, CTA button rendering with both props, no CTA without `ctaAction`, click handler invocation, empty title string, and no CTA without `ctaLabel`. Covers SC-16-01 through SC-16-06, SC-24-01.
- All 55 tests across 7 test files pass. `npm run type-check`, `npm run lint`, and `npm run build` all pass.

## Requirement Coverage

| Requirement | Implementation |
| :---------- | :------------- |
| SC-16 (Empty state component) | `empty-state.vue` — centered layout, optional icon/description/CTA, all string props pre-translated |
| SC-17 (Skeleton loader) | `skeleton-loader.vue` — shimmer div with `animate-pulse bg-surface`, configurable dimensions, `aria-hidden="true"` |
| SC-24 (UI primitive tests, partial) | `empty-state.test.ts` (SC-24-01) and `skeleton-loader.test.ts` (SC-24-02) |

## Internationalization

Both components are translation-agnostic primitives. They do not call `$t()` internally — consuming components pass pre-translated strings via props. No new locale keys were added.

## Dependencies

No new dependencies.

## Known Limitations

- Skeleton composition variants (card skeleton, hero skeleton, etc.) are out of scope — deferred to consuming features.
- No responsive-specific skeleton behavior beyond standard Tailwind responsiveness.
