Feature: SC-17 — Skeleton loader
  The skeleton loader SHALL render an animated placeholder.

  Scenario: SC-17-01 — Skeleton renders with pulse animation
    Given the SkeletonLoader component is mounted with width "100%" and height "2rem"
    When the component mounts
    Then a placeholder div is visible with the specified dimensions
    And the div displays a pulsing shimmer with the surface background color
    And the div has aria-hidden="true"

  Scenario: SC-17-02 — Skeleton with rounded prop
    Given the SkeletonLoader component is mounted with rounded "rounded-full"
    When the component mounts
    Then the placeholder div has fully rounded corners

  Scenario: SC-17-03 — Skeleton renders with default prop values
    Given the SkeletonLoader component is mounted with no props
    When the component mounts
    Then the placeholder div has width "100%", height "1rem", and rounded-md corners
