# Constitution

## 1. Core Principles

**Mission:** A personal, offline-first movie and TV tracker.

- **Privacy first** — All user data stays in localStorage. No accounts, no server, no telemetry.
- **Dark cinematic aesthetic** — Immersive dark backgrounds, hero images, and rich media.
- **TMDB-powered** — [TMDB](https://developer.themoviedb.org/docs/getting-started) is the sole data API: images, trailers, streaming, trending, and recommendations.

## 2. Tech Stack

- **Language:** TypeScript 5 (strict mode)
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build:** Vite
- **Routing:** Vue Router
- **Styling:** Tailwind CSS (dark theme config)
- **Storage:** localStorage via a typed composable wrapper
- **API:** TMDB REST API with response caching in localStorage

## 3. Guardrails

- **No `any`** — Every `any` requires a suppressed lint rule and a documented reason.
- **No server state** — All persistence is localStorage. No backend, no cookies, no IndexedDB.
- **Typed everywhere** — All localStorage access goes through a typed service. Raw `JSON.parse` / `JSON.stringify` calls outside that service are prohibited.
- **Tailwind only** — No inline styles or separate CSS files. All styling through Tailwind utility classes and the theme config.

## 4. Design & UX

- **Transitions** — Subtle and smooth: fade-ins, gentle slide-ins, soft route transitions (~200-300ms).
- **Loading states** — Skeleton loaders with shimmer placeholders matching the layout shape.
- **Empty states** — Guided messaging with a call-to-action (e.g., "Your library is empty. Search for a movie to get started.").
- **Responsive** — Desktop-first, with mobile support.
- **Accessibility** — Minimal. Basic browser-default keyboard support (tabbable links/buttons), no custom keyboard handling or WCAG compliance.

## 5. Error Handling

- **API failures** — Toast notification informing the user, with a retry option.
- **Storage issues** — Toast notification alerting the user (e.g., "Storage issue detected. Some data may not be saved.").
- **Unexpected crashes** — Global error boundary catching unhandled errors, showing a "Something went wrong" fallback with a reload option.

## 6. Browser Support

- **Modern evergreen only** — Latest versions of Chrome, Firefox, Safari, Edge. No IE, no legacy.
