# Scenario: Empty Library Fallback

## ID

SC-05-02

## Given

- An empty user library.

## When

- The home screen is loaded.

## Then

- No "Recommended for You" sections are displayed.
- "Trending" and "Popular" sections are displayed as normal.
- No recommendation API calls are made.
