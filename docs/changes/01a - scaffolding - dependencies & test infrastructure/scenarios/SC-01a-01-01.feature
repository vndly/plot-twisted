Feature: SC-01a-01 — Dependency installation
  The project SHALL have `vue-router@^4.5` as a runtime dependency
  and `@vue/test-utils@^2.4` as a dev dependency.

  Background:
    Given Phase 00 (Setup) is complete
    When I inspect `package.json`

  Scenario: SC-01a-01-01 — vue-router listed in dependencies
    Then `vue-router` is listed under `dependencies` with a version satisfying `^4.5`
