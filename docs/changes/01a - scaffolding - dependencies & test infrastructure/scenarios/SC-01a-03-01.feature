Feature: SC-01a-03 — Test setup file
  The test setup file SHALL clear `localStorage` between tests
  and provide TypeScript global recognition for Vitest.

  Scenario: SC-01a-03-01 — localStorage cleared between tests
    Given `tests/setup.ts` exists
    And `vitest.config.ts` includes `setupFiles: ["./tests/setup.ts"]`
    When a test suite with two tests runs in sequence where the first writes to `localStorage`
    Then `localStorage.length` is 0 before the second test body executes
