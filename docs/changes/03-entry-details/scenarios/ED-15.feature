Feature: Synopsis

  The entry's overview/synopsis is displayed in full below the metadata.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-15-01 - Synopsis displays full overview
    Given the entry has a non-empty overview
    When the detail page loads
    Then the full overview text is displayed

  Scenario: ED-15-02 - Synopsis section hidden when empty
    Given the entry has an empty overview
    When the detail page loads
    Then the synopsis section is not rendered
