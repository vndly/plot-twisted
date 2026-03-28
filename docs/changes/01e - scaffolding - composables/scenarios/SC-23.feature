Feature: SC-23 — Composable unit tests
  Composable tests SHALL verify toast and modal state management.

  Scenario: SC-23-01 — Toast composable: addToast adds to queue
    Given the toast queue is empty
    When addToast is called with a message
    Then the toast queue contains one toast with a unique ID

  Scenario: SC-23-02 — Toast composable: auto-dismiss
    Given the toast queue is empty
    When addToast is called with a message
    And TOAST_DISMISS_MS (4000 ms) elapses
    Then the toast is automatically removed from the queue

  Scenario Outline: SC-23-03 — Toast composable: type variants
    Given the toast queue is empty
    When addToast is called with type "<type>"
    Then the created toast has type "<type>"

    Examples:
      | type    |
      | error   |
      | success |
      | info    |

  Scenario: SC-23-04 — Modal composable: open and close
    Given no modal is active
    When open(props) is called with title "Test"
    Then isOpen is true
    And stored props contain title "Test"
    When close() is called
    Then isOpen is false
    And stored props are null

  Scenario: SC-23-05 — Modal composable: confirm callback stored
    Given no modal is active
    When open(props) is called with an onConfirm callback
    Then the onConfirm callback is stored and accessible in modal props

  Scenario: SC-23-06 — Modal composable: cancel callback stored
    Given no modal is active
    When open(props) is called with an onCancel callback
    Then the onCancel callback is stored and accessible in modal props

  Scenario: SC-23-07 — Modal composable: single-instance replacement
    Given a modal is open with title "First"
    When open(props) is called with title "Second"
    Then stored props contain title "Second"
    And the previous props are no longer accessible

  Scenario: SC-23-08 — Toast composable: max-toast eviction
    Given 5 toasts are in the queue
    When addToast is called with a new message
    Then the oldest toast is evicted
    And the queue contains 5 toasts

  Scenario: SC-23-09 — Toast composable: removeToast removes from queue
    Given the toast queue contains one toast
    When removeToast is called with that toast's ID
    Then the toast queue is empty

  Scenario: SC-23-10 — Modal composable: close when already closed is a no-op
    Given no modal is active
    When close() is called
    Then isOpen remains false
    And no error is thrown

  Scenario: SC-23-11 — Toast composable: removeToast clears auto-dismiss timer
    Given a toast has been added to the queue
    When removeToast is called with that toast's ID
    And TOAST_DISMISS_MS (4000 ms) elapses
    Then no additional toast is removed from the queue

  Scenario: SC-23-12 — Toast composable: removeToast with unknown ID is a no-op
    Given the toast queue contains one toast
    When removeToast is called with an ID that does not exist
    Then the toast queue still contains one toast
    And no error is thrown

  Scenario: SC-23-13 — Toast composable: unique ID generation
    Given the toast queue is empty
    When addToast is called twice with different messages
    Then the two toasts have distinct, incrementing IDs
