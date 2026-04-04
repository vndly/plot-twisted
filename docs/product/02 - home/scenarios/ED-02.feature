Feature: Metadata Panel

  The MetadataPanel component displays key information about the movie or TV show
  including year, runtime, genres, and credits.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-02-01 - Year displays from release date
    Given the movie has release_date "2023-07-21"
    When the detail page loads
    Then the year "2023" is displayed in the metadata panel

  Scenario: ED-02-02 - Runtime displays for movies
    Given the movie has runtime 148 minutes
    When the detail page loads
    Then the runtime is displayed as "2h 28m"

  Scenario: ED-02-03 - Season and episode count displays for TV shows
    Given the TV show has 5 seasons and 62 episodes
    When the detail page loads
    Then the metadata shows "5 Seasons" and "62 Episodes"

  Scenario: ED-02-04 - Genres display as comma-separated list
    Given the entry has genres ["Action", "Sci-Fi", "Adventure"]
    When the detail page loads
    Then the genres are displayed as "Action, Sci-Fi, Adventure"

  Scenario: ED-02-05 - Directors extracted from crew
    Given the movie credits include crew members with job "Director"
    When the detail page loads
    Then the directors are displayed with label "Director" or "Directors"

  Scenario: ED-02-06 - Writers extracted from crew
    Given the movie credits include crew members in department "Writing"
    When the detail page loads
    Then the writers are displayed with label "Writer" or "Writers"

  Scenario: ED-02-07 - Spoken languages display
    Given the entry has spoken_languages ["English", "Spanish"]
    When the detail page loads
    Then the languages are displayed

  Scenario: ED-02-08 - Missing data omitted
    Given the entry has no directors in the crew
    When the detail page loads
    Then the directors section is not rendered
    And no empty placeholder is shown
