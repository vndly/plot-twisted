Feature: SC-01a-03 — Test setup file
  The test setup file SHALL clear `localStorage` between tests
  and provide TypeScript global recognition for Vitest.

  Scenario: SC-01a-03-02 — TypeScript recognizes Vitest globals
    Given `tests/setup.ts` includes `/// <reference types="vitest/globals" />`
    When a `.test.ts` file uses `describe`, `it`, `expect`, and `beforeEach` without explicit imports from `vitest`
    Then the file compiles with zero TypeScript errors
