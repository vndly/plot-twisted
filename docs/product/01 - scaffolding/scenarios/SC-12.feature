Feature: SC-12 — Modal composable behavior
  The modal composable SHALL manage single-instance modal state.

  Scenario: SC-12-01 — Modal opens with provided props
    Given no modal is currently visible
    When a modal is opened with title "Confirm Action" and content "Are you sure?"
    Then the modal is visible
    And it displays the provided title and content

  Scenario: SC-12-02 — Modal closes and clears state
    Given a modal is open with title "Confirm Action"
    When the modal is closed
    Then no modal is visible
    And the stored modal props are cleared

  Scenario: SC-12-03 — Single-instance replacement
    Given a modal is open with title "First"
    When a second modal is opened with title "Second"
    Then only one modal is visible
    And it displays the title "Second"

  Scenario: SC-12-04 — Closing when no modal is open has no effect
    Given no modal is currently visible
    When the modal is closed
    Then no error is thrown
    And no modal is visible

  Scenario: SC-12-05 — Modal opens with confirm and cancel labels
    Given no modal is currently visible
    When a modal is opened with title "Delete Item", confirmLabel "Delete", and cancelLabel "Keep"
    Then the modal is visible
    And the stored props contain confirmLabel "Delete" and cancelLabel "Keep"
