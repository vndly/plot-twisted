Feature: SC-08 — Page header
  The page header SHALL display the translated name of the current page.

  Scenario: SC-08-01 — Header shows the current page title
    Given the page header component is rendered for the `/calendar` route
    When the route metadata includes `page.calendar.title`
    Then the page header displays the translated "Calendar" title

  Scenario: SC-08-02 — Header updates on navigation
    Given the page header component is rendered for the Home route
    When I navigate to `/settings`
    Then the page header updates from the Home title to the Settings title

  Scenario: SC-08-03 — Header uses sticky positioning
    Given the page header component is rendered in a scrollable content area
    When I inspect the rendered header
    Then it uses sticky positioning at the top of the content area

  Scenario: SC-08-04 — Header renders translated output in a non-default locale
    Given the language is "es"
    And the page header component is rendered for the `/library` route
    When the route metadata includes `page.library.title`
    Then the page header displays "Biblioteca"
