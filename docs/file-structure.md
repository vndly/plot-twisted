# File Structure

## Top-Level

```
├── docs/          # Project documentation (specs, roadmap, technical)
└── src/           # Application source code (see Architecture below)
```

## Source Code (`src/`)

The `src/` folder follows a 4-layer architecture. Refer to [architecture.md](./technical/architecture.md) for full details on layer responsibilities, dependency rules, and data flow.

```
src/
├── presentation/      # Layer 1 — Vue SFCs, views, router
├── application/       # Layer 2 — Composables orchestrating Domain + Infrastructure
├── domain/            # Layer 3 — Zod schemas, types, pure business logic
├── infrastructure/    # Layer 4 — TMDB API client, localStorage wrapper
└── assets/            # Static files and Tailwind entry CSS
```
