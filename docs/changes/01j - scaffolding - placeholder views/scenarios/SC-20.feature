Feature: SC-20 — Placeholder views
  Each route SHALL render translated placeholder content.

  Scenario Outline: SC-20-01 — Placeholder shows translated route content
    Given the active locale is `<locale>`
    And I navigate to `<route>`
    When the view loads
    Then the placeholder empty state shows the <icon> icon
    And the heading is "<page_title>"
    And the supporting text is "<description>"

    Examples:
      | route     | icon         | locale | page_title | description                        |
      | /         | House        | en     | Home       | This page is under construction.   |
      | /calendar | CalendarDays | en     | Calendar   | This page is under construction.   |
      | /library  | Bookmark     | en     | Library    | This page is under construction.   |
      | /settings | Settings     | en     | Settings   | This page is under construction.   |
      | /         | House        | fr     | Accueil    | Cette page est en construction.    |
