Feature: SC-24 — UI primitive tests (partial)
  UI primitive component tests SHALL verify rendering and behavior.
  This feature covers SC-24-01 and SC-24-02; sibling features 01g and 01h cover remaining scenarios.

  Scenario: SC-24-01 — EmptyState component test suite
    Given the EmptyState test file exists at tests/presentation/components/common/empty-state.test.ts
    When the test suite runs
    Then it verifies rendering with all props (icon, title, description, CTA)
    And it verifies rendering with only the title prop
    And it verifies CTA button click invokes the handler
    And it verifies no CTA renders without ctaAction

  Scenario: SC-24-02 — SkeletonLoader component test suite
    Given the SkeletonLoader test file exists at tests/presentation/components/common/skeleton-loader.test.ts
    When the test suite runs
    Then it verifies rendering with specified dimensions
    And it verifies the pulsing shimmer animation
    And it verifies custom rounded prop
    And it verifies default prop values
    And it verifies aria-hidden="true" on the rendered div
