Feature: Trailer Embed

  The TrailerEmbed component displays the official YouTube trailer with a
  privacy-conscious implementation that only loads on user interaction.

  Background:
    Given the app is running
    And the user is on a detail page

  Scenario: ED-04-01 - Play button displays initially
    Given the entry has an official YouTube trailer
    When the detail page loads
    Then a play button overlay is displayed over a dark background
    And no YouTube iframe is loaded

  Scenario: ED-04-02 - Clicking play embeds trailer
    Given the entry has an official YouTube trailer
    And the detail page is loaded
    When the user clicks the play button
    Then the YouTube iframe is embedded
    And the trailer begins playing

  Scenario: ED-04-03 - Privacy-enhanced mode used
    Given the entry has an official YouTube trailer
    And the user clicks the play button
    When the iframe loads
    Then the iframe src uses "youtube-nocookie.com" domain

  Scenario: ED-04-04 - Trailer section hidden when no trailer
    Given the entry has no videos with type "Trailer" and site "YouTube"
    When the detail page loads
    Then the trailer section is not rendered

  Scenario: ED-04-05 - First matching trailer used
    Given the entry has multiple trailer videos
    When the detail page loads
    Then the first video matching type "Trailer" and site "YouTube" is used
