Feature: SC-05 — Desktop sidebar
  The desktop sidebar SHALL render the current scaffolded primary navigation set.

  Background:
    Given the viewport width is 768px or above

  Scenario: SC-05-01 — Sidebar renders the desktop navigation structure
    When the sidebar navigation component is rendered
    Then a fixed left sidebar with width `w-56` and a dark background is visible
    And the app title is visible at the top of the sidebar
    And navigation links for Home, Calendar, Library, and Settings are visible

  Scenario: SC-05-02 — Sidebar uses the documented icon and translation mappings
    Given the language is "fr"
    When the sidebar navigation component is rendered
    Then each nav item uses its mapped lucide icon
    And the labels are rendered from the `nav.home`, `nav.calendar`, `nav.library`, and `nav.settings` translations
