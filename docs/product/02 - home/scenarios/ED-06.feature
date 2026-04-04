Feature: Rating Stars

  The RatingStars component allows users to set a 1-5 star personal rating
  that persists in localStorage.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-06-01 - Five stars displayed
    When the detail page loads
    Then 5 star icons are displayed
    And all stars are in empty/outline state when no rating set

  Scenario: ED-06-02 - Hover previews selection
    Given the detail page is loaded
    When the user hovers over the 3rd star
    Then stars 1-3 appear filled
    And stars 4-5 remain empty

  Scenario: ED-06-03 - Click sets rating
    Given the detail page is loaded
    When the user clicks the 4th star
    Then stars 1-4 are filled
    And the rating 4 is persisted in localStorage

  Scenario: ED-06-04 - Click same star clears rating
    Given the user has set a rating of 4
    When the user clicks the 4th star again
    Then all stars return to empty state
    And the rating is cleared (set to 0) in localStorage

  Scenario: ED-06-05 - Rating persists on refresh
    Given the user has set a rating of 3
    When the user refreshes the page
    Then stars 1-3 are filled on load

  Scenario: ED-06-06 - Keyboard navigation
    Given the rating stars have keyboard focus
    When the user presses the right arrow key
    Then the focus moves to the next star
    And pressing Enter selects that rating
