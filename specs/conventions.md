# Conventions

## 1. Design & UX

- **Transitions** — Subtle and smooth: fade-ins, gentle slide-ins, soft route transitions (~200-300ms).
- **Loading states** — Skeleton loaders with shimmer placeholders matching the layout shape.
- **Empty states** — Guided messaging with a call-to-action (e.g., "Your library is empty. Search for a movie to get started.").
- **Responsive** — Desktop-first, with mobile support.
- **Accessibility** — Minimal. Basic browser-default keyboard support (tabbable links/buttons), no custom keyboard handling or WCAG compliance.

## 2. Error Handling

- **API failures** — Toast notification informing the user, with a retry option.
- **Storage issues** — Toast notification alerting the user (e.g., "Storage issue detected. Some data may not be saved.").
- **Unexpected crashes** — Global error boundary catching unhandled errors, showing a "Something went wrong" fallback with a reload option.

## 3. Browser Support

- **Modern evergreen only** — Latest versions of Chrome, Firefox, Safari, Edge. No IE, no legacy.
