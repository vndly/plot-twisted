Feature: SC-01a-03 — Test setup file
  The test setup file SHALL clear `localStorage` between tests
  and provide TypeScript global recognition for Vitest.

  Scenario: SC-01a-03-03 — Without setup file, localStorage state leaks between tests
    Given `vitest.config.ts` does NOT include `setupFiles: ["./tests/setup.ts"]`
    When two tests run in sequence where the first writes to `localStorage` and the second reads from it
    Then the second test observes the first test's `localStorage` data (state leaks between tests)
