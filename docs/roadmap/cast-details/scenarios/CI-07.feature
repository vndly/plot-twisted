Feature: External links
  Display clickable external profile links

  Background:
    Given the app is running

  Scenario: CI-07-01 — All external links display when available
    Given a person with IMDB, Instagram, and Twitter profiles
    When I view the person page
    Then I see the IMDB icon
    And I see the Instagram icon
    And I see the Twitter icon

  Scenario: CI-07-02 — External link opens in new tab
    Given a person with an IMDB profile
    When I click the IMDB icon
    Then the IMDB page opens in a new tab
    And the link has rel="noopener noreferrer"

  Scenario: CI-07-03 — Missing links are hidden
    Given a person with only an IMDB profile (no Instagram or Twitter)
    When I view the person page
    Then I see only the IMDB icon
    And the Instagram icon is not displayed
    And the Twitter icon is not displayed

  Scenario: CI-07-04 — No links hides entire section
    Given a person with no external profiles
    When I view the person page
    Then the external links section is not displayed
