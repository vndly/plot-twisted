Feature: Favorite Toggle

  The favorite button allows users to mark entries as favorites, persisting
  the state in localStorage.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-07-01 - Outline heart when not favorited
    Given the entry is not favorited
    When the detail page loads
    Then the favorite button displays an outline heart icon

  Scenario: ED-07-02 - Filled heart when favorited
    Given the entry is favorited
    When the detail page loads
    Then the favorite button displays a filled heart icon

  Scenario: ED-07-03 - Click toggles favorite state
    Given the entry is not favorited
    When the user clicks the favorite button
    Then the icon changes to a filled heart
    And the favorite state is persisted in localStorage

  Scenario: ED-07-04 - Favorite persists on refresh
    Given the user has favorited the entry
    When the user refreshes the page
    Then the filled heart icon is displayed on load
