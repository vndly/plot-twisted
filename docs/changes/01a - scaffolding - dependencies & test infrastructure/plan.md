# Implementation Plan: Dependencies & Test Infrastructure

---

## Phase 1 — Dependencies & Test Infrastructure

### Step 1 — Install dependencies (SC-01)

- [ ] Run `npm install vue-router@^4`.
- [ ] Run `npm install -D @vue/test-utils@^2`.

> Rollback: `npm uninstall vue-router @vue/test-utils` and revert `package.json` / `package-lock.json`.

### Step 2 — Configure test environment (SC-27, SC-28)

- [ ] Update `vitest.config.ts`: add `globals: true`, `include: ["tests/**/*.test.ts"]`, `setupFiles: ["./tests/setup.ts"]` inside the existing `test: { }` block in the `defineConfig` call. Preserve the existing `mergeConfig(viteConfig, defineConfig(...))` pattern and the `environment: 'jsdom'` setting — do not restructure the config. The `@` path alias (`@ → ./src`) is inherited from `vite.config.ts` via `mergeConfig` and does not need separate configuration (covering SC-27-01, SC-27-02).
- [ ] Create `tests/setup.ts` with `/// <reference types="vitest/globals" />` at the top and `beforeEach(() => { localStorage.clear() })`. Since `globals: true` is set in the previous substep, `beforeEach` is available without importing from `vitest` (covering SC-28-01, SC-28-02).

> Note: `tsconfig.app.json` includes only `src/**/*` and does not cover the `tests/` directory. Vitest handles TypeScript compilation for test files separately via its own resolution, so no `tsconfig` changes are needed.

> Rollback: revert `vitest.config.ts` to its previous state and delete `tests/setup.ts`.

### Step 3 — Update testing documentation `(implementation detail)`

- [ ] Remove the `import { describe, it, expect } from 'vitest'` line from the code example in `docs/technical/testing.md`, so the example starts with `import { isHighRated } from '@/domain/movie.logic'`. This aligns the reference documentation with the `globals: true` convention established in Step 2.

> Rollback: revert `docs/technical/testing.md` to its previous state.

---

## Phase 2 — Verification

> **Testing phase note:** No automated test files are produced in this phase because the scope is pure infrastructure with no testable application logic. Tests are deferred to downstream phases (01b–01k) that will use the infrastructure established here.

> This phase has no user-facing scenarios. Verification confirms the infrastructure is correctly configured. See `scenarios.md` for scenario IDs.

### Step 4 — Run verification checks (SC-01, SC-27, SC-28)

- [ ] Verify `package.json` lists `vue-router` under `dependencies` and `@vue/test-utils` under `devDependencies` (SC-01-01, SC-01-02).
- [ ] Verify `vitest.config.ts` contains `globals: true`, `include: ["tests/**/*.test.ts"]`, and `setupFiles: ["./tests/setup.ts"]` (SC-27-01) and that the existing `environment: 'jsdom'` setting is preserved (SC-27-02).
- [ ] Verify `tests/setup.ts` calls `localStorage.clear()` in `beforeEach` (SC-28-01) and includes `/// <reference types="vitest/globals" />` (SC-28-02).
- [ ] Run `npm run test` — must exit with zero config errors (SC-27-03).
- [ ] Run `npm run check` — format, lint, type-check, test, and build must all pass with zero failures (SC-27-04).

> SC-28-03 (without setup file, localStorage state leaks between tests) is a design-rationale scenario validated implicitly by SC-27-01 and SC-28-01 — no separate verification step needed.
