Feature: Loading Skeleton

  The detail view displays a skeleton loader matching the layout while the
  API request is in flight.

  Background:
    Given the app is running

  Scenario: ED-11-01 - Skeleton displays while loading
    When the user navigates to a detail page
    And the API request is in flight
    Then a loading skeleton is displayed

  Scenario: ED-11-02 - Skeleton matches detail layout
    When the loading skeleton is displayed
    Then it includes a backdrop placeholder
    And title line placeholders
    And metadata line placeholders
    And cast circle placeholders
    And action button placeholders

  Scenario: ED-11-03 - Skeleton has shimmer animation
    When the loading skeleton is displayed
    Then the skeleton elements have shimmer animation

  Scenario: ED-11-04 - Content replaces skeleton on load
    Given the loading skeleton is displayed
    When the API request completes successfully
    Then the skeleton is replaced with the actual content
