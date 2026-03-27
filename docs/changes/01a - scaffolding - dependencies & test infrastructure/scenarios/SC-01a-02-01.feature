Feature: SC-01a-02 — Vitest configuration
  The Vitest configuration SHALL be updated with `globals: true`, correct file inclusion,
  setup file reference, and the existing `environment: 'jsdom'` setting preserved.

  Scenario Outline: SC-01a-02-01 — Vitest config properties set correctly
    Given Phase 00 (Setup) is complete
    And `vitest.config.ts` has been updated
    When I inspect the `test` block in the config
    Then `<property>` is set to `<value>`

    Examples:
      | property    | value                  |
      | globals     | true                   |
      | include     | ["tests/**/*.test.ts"] |
      | setupFiles  | ["./tests/setup.ts"]   |
      | environment | 'jsdom'                |
