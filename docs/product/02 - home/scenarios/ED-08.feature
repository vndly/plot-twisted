Feature: Watch Status

  The watch status control allows users to set entries as watchlist, watched,
  or none, persisting the state in localStorage.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-08-01 - Status displays current state
    Given the entry has status "watchlist"
    When the detail page loads
    Then the watchlist indicator is active/highlighted

  Scenario: ED-08-02 - Set to watchlist
    Given the entry has status "none"
    When the user sets status to "watchlist"
    Then the watchlist indicator becomes active
    And the status is persisted as "watchlist" in localStorage

  Scenario: ED-08-03 - Set to watched
    Given the entry has status "none"
    When the user sets status to "watched"
    Then the watched indicator becomes active
    And the status is persisted as "watched" in localStorage

  Scenario: ED-08-04 - Remove from list
    Given the entry has status "watchlist"
    When the user sets status to "none"
    Then no status indicator is active
    And the status is persisted as "none" in localStorage

  Scenario: ED-08-05 - Status persists on refresh
    Given the user has set status to "watched"
    When the user refreshes the page
    Then the watched indicator is active on load
