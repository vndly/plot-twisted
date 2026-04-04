Feature: Box Office Data

  The BoxOffice component displays budget and revenue information for movies,
  formatted as currency values.

  Background:
    Given the app is running

  Scenario: ED-16-01 - Budget and revenue display for movie
    Given the movie has budget 200000000 and revenue 800000000
    When the user navigates to the movie detail page
    Then the box office section is displayed
    And the budget is shown as "$200,000,000"
    And the revenue is shown as "$800,000,000"

  Scenario: ED-16-02 - Only budget available
    Given the movie has budget 150000000 and revenue 0
    When the user navigates to the movie detail page
    Then the box office section is displayed
    And the budget is shown as "$150,000,000"
    And the revenue shows as unavailable or is omitted

  Scenario: ED-16-03 - Only revenue available
    Given the movie has budget 0 and revenue 500000000
    When the user navigates to the movie detail page
    Then the box office section is displayed
    And the revenue is shown as "$500,000,000"
    And the budget shows as unavailable or is omitted

  Scenario: ED-16-04 - Both values zero hides section
    Given the movie has budget 0 and revenue 0
    When the user navigates to the movie detail page
    Then the box office section is not rendered

  Scenario: ED-16-05 - Box office not shown for TV shows
    Given the user navigates to a TV show detail page
    When the detail page loads
    Then the box office section is not rendered
