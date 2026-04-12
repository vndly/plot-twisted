Feature: FR-06-03 — Month Navigation

  Background:
    Given the app is running
    And I am on the "/calendar" page

  Scenario: SC-06-03-01 — Navigating to next month
    When I click the "Next Month" button
    Then the grid should update to show the next month
    And a new API request should be made for the next month's releases

  Scenario: SC-06-03-02 — Navigating to previous month
    When I click the "Previous Month" button
    Then the grid should update to show the previous month
    And a new API request should be made for the previous month's releases

  Scenario: SC-06-03-03 — Month view persists on reload
    Given I have navigated to the "Next Month"
    When I reload the page
    Then the grid should still show the "Next Month"
