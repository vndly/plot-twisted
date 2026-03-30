Feature: SC-15 — Modal dialog component
  The modal SHALL display a centered dialog with backdrop.

  Scenario: SC-15-01 — Modal opens and shows content
    Given a modal is requested with title "Confirm Delete" and content "This action cannot be undone"
    When the modal appears
    Then a semi-transparent dark backdrop overlay covers the screen
    And a centered card shows "Confirm Delete" with the content text, confirm, and cancel buttons

  Scenario: SC-15-02 — Modal closes on backdrop click
    Given the modal is open
    When I click on the backdrop (outside the content card)
    Then the modal closes

  Scenario: SC-15-03 — Modal closes on Escape key
    Given the modal is open
    When I press the Escape key
    Then the modal closes

  Scenario: SC-15-04 — Confirm callback
    Given the modal is open with onConfirm and onCancel callbacks
    When I click the confirm button
    Then the onConfirm callback is invoked
    And the modal closes

  Scenario: SC-15-05 — Cancel callback
    Given the modal is open with onConfirm and onCancel callbacks
    When I click the cancel button
    Then the onCancel callback is invoked
    And the modal closes

  Scenario: SC-15-06 — Opening a new modal replaces the current one
    Given a modal is open with title "First Modal"
    When a new modal is requested with title "Second Modal"
    Then the first modal's content is replaced by "Second Modal"
    And only one modal is visible

  Scenario: SC-15-07 — Modal open and close transitions
    Given a modal is requested
    When the modal opens
    Then the backdrop fades in and the content card scales up (200-300 ms, ease-in-out)
    When the modal closes
    Then the backdrop fades out and the content card scales down

  Scenario: SC-15-08 — Modal text renders in non-default locale
    Given the app locale is set to "es"
    When a modal is opened without custom button labels
    Then the confirm and cancel buttons display labels in Spanish

  Scenario: SC-15-09 — Modal transitions disabled with reduced motion
    Given the user has prefers-reduced-motion set to reduce
    When a modal is opened
    Then it appears without fade or scale animation
    When the modal is closed
    Then it disappears without animation
