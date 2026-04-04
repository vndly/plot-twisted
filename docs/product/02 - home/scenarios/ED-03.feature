Feature: Cast Carousel

  The CastCarousel component displays a horizontally scrollable list of cast
  members with headshots and character names.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-03-01 - Cast carousel renders horizontally
    Given the entry has 10 cast members
    When the detail page loads
    Then a horizontally scrollable cast section is displayed

  Scenario: ED-03-02 - Cast sorted by billing order
    Given the entry has cast members with different order values
    When the detail page loads
    Then cast members are displayed sorted by their order value (lowest first)

  Scenario: ED-03-03 - Cast member displays headshot
    Given a cast member has a profile_path
    When the detail page loads
    Then the cast member's headshot image is displayed

  Scenario: ED-03-04 - Placeholder for missing headshot
    Given a cast member has profile_path null
    When the detail page loads
    Then a person silhouette placeholder icon is displayed

  Scenario: ED-03-05 - Cast member displays names
    Given a cast member has name "Tom Hanks" and character "Forrest Gump"
    When the detail page loads
    Then "Tom Hanks" is displayed as the actor name
    And "Forrest Gump" is displayed as the character name

  Scenario: ED-03-06 - Cast limited to 20 members
    Given the entry has 50 cast members
    When the detail page loads
    Then only the first 20 cast members are displayed
