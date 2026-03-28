Feature: SC-16 — Empty state component
  The empty state SHALL display a centered placeholder message.
  String props receive pre-translated values from the consuming component.
  i18n coverage is not applicable — this primitive receives pre-translated strings via props.

  Background:
    Given the EmptyState component is mounted

  Scenario: SC-16-01 — Empty state renders with icon and text
    Given the component receives icon, title, and description props
    When the component mounts
    Then the icon, title, and description are visible
    And the content is centered in the content area

  Scenario: SC-16-02 — Empty state with only title prop
    Given the component receives only a title prop (no icon, no description)
    When the component mounts
    Then the title renders
    And the icon and description are absent

  Scenario: SC-16-03 — Empty state with CTA button rendering
    Given the component receives ctaLabel "Try Again" and ctaAction handler
    When the component mounts
    Then a "Try Again" button is rendered with primary teal styling

  Scenario: SC-16-04 — Empty state with ctaLabel but no ctaAction
    Given the component receives ctaLabel "Try Again" but no ctaAction handler
    When the component mounts
    Then no CTA button is rendered

  Scenario: SC-16-05 — CTA button invokes handler on click
    Given the component receives ctaLabel "Try Again" and ctaAction handler
    When the user clicks the "Try Again" button
    Then the ctaAction handler is invoked

  Scenario: SC-16-06 — Empty state with empty title string
    Given the component receives an empty string as the title prop
    When the component mounts
    Then the component renders without error
