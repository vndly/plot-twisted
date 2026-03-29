Feature: SC-14 — Toast container component
  The toast container SHALL render the toast queue as a fixed overlay.

  Scenario: SC-14-01 — Multiple toasts stack
    Given an info toast "Message 1" and a success toast "Message 2" are triggered in quick succession
    When both toasts are visible
    Then they stack vertically in the top-right corner with consistent spacing and without overlapping

  Scenario: SC-14-02 — Toast container positioning
    Given a toast is triggered
    When the toast container renders
    Then it is fixed to the top-right of the viewport with z-50

  Scenario: SC-14-03 — Dismiss button removes toast
    Given a toast is visible
    When I click the dismiss button on the toast
    Then the toast is removed from the container

  Scenario: SC-14-04 — Oldest toast evicted when max exceeded
    Given 5 toasts are already visible
    When a 6th toast is triggered
    Then the oldest toast is removed
    And the new toast is added to the container

  Scenario: SC-14-05 — Toast enter and leave transitions
    Given a toast is triggered
    When the toast appears
    Then it slides in from the right (300 ms, ease-in-out)
    When the toast is dismissed
    Then it fades out (200 ms, ease-in-out)

  Scenario Outline: SC-14-06 — Type-colored left border
    Given a <type> toast is triggered
    When the toast renders
    Then it displays a left border colored <color>

    Examples:
      | type    | color                   |
      | error   | --color-error (red)     |
      | success | --color-success (green) |
      | info    | --color-accent (teal)   |

  Scenario: SC-14-07 — Toast auto-dismisses after timeout
    Given a toast is triggered
    When TOAST_DISMISS_MS elapses without user interaction
    Then the toast is automatically removed from the container

  Scenario: SC-14-08 — Transitions disabled with reduced motion
    Given the user has prefers-reduced-motion set to reduce
    When a toast is triggered
    Then it appears without slide-in animation
    When the toast is dismissed
    Then it disappears without fade-out animation

  Scenario: SC-14-09 — Toast text renders in non-default locale
    Given the app locale is set to "es"
    When an error toast is triggered
    Then the dismiss button label is displayed in Spanish
