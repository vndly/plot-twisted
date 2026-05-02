Feature: Error handling
  Show appropriate error states

  Background:
    Given the app is running

  Scenario: CI-12-01 — 404 shows person not found
    When I navigate to /person/999999999
    And the API returns 404
    Then I see "Person not found"
    And a link to Home is displayed

  Scenario: CI-12-02 — Network error shows toast
    When I navigate to a person page
    And a network error occurs
    Then a localized network error toast appears
    And the toast has a localized "Retry" action

  Scenario Outline: CI-12-03 — Retry action refetches person data
    Given a <errorType> error toast is displayed
    When I click the "Retry" action
    Then the person API request is attempted again
    And the person detail page displays if the retry succeeds

    Examples:
      | errorType |
      | network   |
      | server    |

  Scenario: CI-12-04 — Server error shows retry toast
    When I navigate to a person page
    And the API returns a 500 server error
    Then a localized server error toast appears
    And the toast has a localized "Retry" action
