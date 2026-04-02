Feature: SC-26 — Placeholder view tests
  Placeholder view tests SHALL verify each route renders the documented placeholder content.

  Scenario Outline: SC-26-01 — Route view test verifies placeholder content
    Given the `<test_file>` component test mounts the `<route>` view with locale `<locale>`
    When the test suite runs
    Then it verifies the placeholder view shows the <icon> icon
    And it verifies the heading is "<page_title>"
    And it verifies the supporting text is "<description>"

    Examples:
      | test_file                 | route      | icon         | locale | page_title | description                      |
      | home-screen.test.ts       | /          | House        | en     | Home       | This page is under construction. |
      | calendar-screen.test.ts   | /calendar  | CalendarDays | en     | Calendar   | This page is under construction. |
      | library-screen.test.ts    | /library   | Bookmark     | en     | Library    | This page is under construction. |
      | settings-screen.test.ts   | /settings  | Settings     | en     | Settings   | This page is under construction. |
