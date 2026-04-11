# Scenario: Seed Selection

## ID

SC-05-01

## Given

- A library with 10 entries.
- 3 entries have ratings (5, 4, 3 stars).
- 7 entries have no ratings (0 stars).

## When

- Recommendations are requested for the home screen.

## Then

- The 3 rated entries are selected as the first 3 seeds.
- The 2 most recently added/watched entries from the unrated ones are selected as the remaining 2 seeds.
- Total 5 seeds are used for fetching recommendations.
