# Verification Scenarios: App Scaffolding — Dependencies & Test Infrastructure

Feature: App Scaffolding — Dependencies & Test Infrastructure
  Install runtime and dev dependencies, and configure Vitest test infrastructure
  so all subsequent scaffolding phases can write and run tests.

### Requirement: SC-01a-01 — Dependency installation

The project SHALL have `vue-router@^4.5` as a runtime dependency and `@vue/test-utils@^2.4` as a dev dependency.

Background:
  GIVEN Phase 00 (Setup) is complete
  WHEN I inspect `package.json`

#### Scenario: SC-01a-01-01 — vue-router listed in dependencies

THEN `vue-router` is listed under `dependencies` with a version satisfying `^4.5`

#### Scenario: SC-01a-01-02 — @vue/test-utils listed in devDependencies

THEN `@vue/test-utils` is listed under `devDependencies` with a version satisfying `^2.4`

---

### Requirement: SC-01a-02 — Vitest configuration

The Vitest configuration SHALL be updated with `globals: true`, correct file inclusion, setup file reference, and the existing `environment: 'jsdom'` setting preserved.

#### Scenario Outline: SC-01a-02-01 — Vitest config properties set correctly

GIVEN Phase 00 (Setup) is complete
AND `vitest.config.ts` has been updated
WHEN I inspect the `test` block in the config
THEN `<property>` is set to `<value>`

Examples:
  | property    | value                    |
  | globals     | true                     |
  | include     | ["tests/**/*.test.ts"]   |
  | setupFiles  | ["./tests/setup.ts"]     |
  | environment | 'jsdom'                  |

#### Scenario: SC-01a-02-02 — Test runner starts without errors

GIVEN Phase 01a (Dependencies & Test Infrastructure) is complete
WHEN I run `npm run test`
THEN the Vitest runner starts and exits without configuration errors

#### Scenario: SC-01a-02-03 — Full CI check passes

GIVEN Phase 01a (Dependencies & Test Infrastructure) is complete
WHEN I run `npm run check`
THEN format passes with zero failures
AND lint passes with zero failures
AND type-check passes with zero failures
AND test passes with zero failures
AND build passes with zero failures

---

### Requirement: SC-01a-03 — Test setup file

The test setup file SHALL clear `localStorage` between tests and provide TypeScript global recognition for Vitest.

#### Scenario: SC-01a-03-01 — localStorage cleared between tests

GIVEN `tests/setup.ts` exists
AND `vitest.config.ts` includes `setupFiles: ["./tests/setup.ts"]`
WHEN a test suite with two tests runs in sequence where the first writes to `localStorage`
THEN `localStorage.length` is 0 before the second test body executes

#### Scenario: SC-01a-03-02 — TypeScript recognizes Vitest globals

GIVEN `tests/setup.ts` includes `/// <reference types="vitest/globals" />`
WHEN a `.test.ts` file uses `describe`, `it`, `expect`, and `beforeEach` without explicit imports from `vitest`
THEN the file compiles with zero TypeScript errors

#### Scenario: SC-01a-03-03 — Without setup file, localStorage state leaks between tests

GIVEN `vitest.config.ts` does NOT include `setupFiles: ["./tests/setup.ts"]`
WHEN two tests run in sequence where the first writes to `localStorage` and the second reads from it
THEN the second test observes the first test's `localStorage` data (state leaks between tests)
