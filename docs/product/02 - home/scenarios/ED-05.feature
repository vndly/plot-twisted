Feature: Streaming Badges

  The StreamingBadges component displays available streaming providers for the
  user's configured region.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-05-01 - Provider logos display for region
    Given the entry has streaming providers for region "US"
    And the user's preferred region is "US"
    When the detail page loads
    Then the streaming provider logos are displayed

  Scenario: ED-05-02 - Not available message when no providers
    Given the entry has no streaming providers for region "US"
    And the user's preferred region is "US"
    When the detail page loads
    Then "Not available for streaming" text is displayed

  Scenario: ED-05-03 - Different region shows different providers
    Given the entry has different streaming providers for "US" and "GB"
    And the user's preferred region is "GB"
    When the detail page loads
    Then only the GB streaming providers are displayed

  Scenario: ED-05-04 - Missing region data handled gracefully
    Given the entry has no watch/providers data for the user's region
    When the detail page loads
    Then "Not available for streaming" text is displayed
    And no error is thrown
