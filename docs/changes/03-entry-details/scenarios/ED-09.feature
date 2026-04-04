Feature: IMDB Link

  The IMDB link opens the entry's IMDB page in a new tab when available.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-09-01 - IMDB link rendered when imdb_id present
    Given the entry has imdb_id "tt0137523"
    When the detail page loads
    Then an IMDB link/button is displayed

  Scenario: ED-09-02 - IMDB link opens correct URL
    Given the entry has imdb_id "tt0137523"
    When the user clicks the IMDB link
    Then a new tab opens with URL "https://www.imdb.com/title/tt0137523"

  Scenario: ED-09-03 - IMDB link not rendered when imdb_id null
    Given the entry has imdb_id null
    When the detail page loads
    Then the IMDB link/button is not displayed

  Scenario: ED-09-04 - IMDB link has security attributes
    Given the entry has imdb_id "tt0137523"
    When the detail page loads
    Then the IMDB link has rel="noopener noreferrer"
    And the link has target="_blank"
