Feature: LBS-08 Empty search results

  Background:
    Given the app is running
    And I am on the Library screen

  Scenario Outline: LBS-08-01 - Search/filter empty state appears for a non-empty tab reduced to zero
    Given the active language is "<language>"
    And the selected Library tab is "<tab>"
    And the selected Library tab contains an entry titled "Arrival"
    When I type "zzzz" in the Library search input
    And 300ms elapses without more typing
    Then the Library search/filter empty-state title is "<title>"
    And the Library search/filter empty-state description is "<description>"

    Examples:
      | language | tab       | title                         | description                                             |
      | English  | Watchlist | No matches found              | Try a different search term or clear your filters       |
      | Spanish  | Watched   | No se encontraron coincidencias | Prueba con otro término de búsqueda o borra los filtros |

  Scenario Outline: LBS-08-02 - Base Watchlist and Watched empty states are preserved
    Given the active language is English
    And the selected Library tab is "<tab>"
    And the selected Library tab has no base entries
    When the Library screen renders
    Then the base empty-state title is "<title>"
    And the Library search/filter empty state is not visible

    Examples:
      | tab       | title                   |
      | Watchlist | Your watchlist is empty |
      | Watched   | No watched entries yet  |

  Scenario Outline: LBS-08-03 - Empty-state CTA clears the active search/filter state
    Given the active language is "<language>"
    And the selected Library tab is "<tab>"
    And the selected Library tab contains an entry titled "Arrival" with genre "Drama"
    And the selected Library tab contains an entry titled "Batman" with genre "Action"
    When I type "<query>" in the Library search input
    And I set the genre filter to "<filter>"
    And 300ms elapses without more typing
    Then the Library search/filter empty state is visible
    And the empty-state CTA label is "<cta>"
    When I click the empty-state CTA
    Then the Library search input value is "<expected_query>"
    And the selected genre filter is "<expected_filter>"
    And the entry titled "<visible_entry>" is visible

    Examples:
      | language | tab       | query | filter | cta             | expected_query | expected_filter | visible_entry |
      | English  | Watchlist | zzzz  | none   | Clear search    |                | none            | Arrival       |
      | Spanish  | Watched   | zzzz  | none   | Borrar búsqueda |                | none            | Arrival       |
      | Spanish  | Watchlist |       | Comedy | Borrar filtros  |                | none            | Arrival       |
      | English  | Watched   | zzzz  | Comedy | Clear all       |                | none            | Arrival       |
