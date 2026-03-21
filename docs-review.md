# Docs Review

## What's Missing

### Should document

1. **Pagination strategy** — Multiple TMDB endpoints return paginated results (search, trending, popular, recommendations, upcoming). No doc specifies how the app handles multi-page results: infinite scroll? "Load more" button? Single page only? The Library section says "no pagination" for local data, but API-driven screens are unaddressed.
2. **Home screen behavior when search is active vs idle** — What happens when the user clears the search query? Do trending/popular sections reappear? Are search results and trending/popular shown simultaneously or does search replace them?
3. **Security considerations** — The TMDB bearer token handling, XSS prevention for user-provided strings (notes, tags, list names), and localStorage data integrity are only lightly touched. A brief section covering: token exposure risk (it's in client-side code), sanitization approach, and the trust model would be useful.
4. **CI/CD pipeline** — Deployment doc covers only manual `firebase deploy`. No mention of automated testing on push, build validation, or any GitHub Actions/CI setup.

### Could document (lower priority)

5. **Error retry behavior details** — `api.md` mentions exponential backoff (1s, 2s, 4s, max 3 attempts) for rate limiting. Do other error types (500+, network errors) also retry? The automatic vs manual retry boundary isn't clear.
6. **localStorage size limits** — The app stores everything in localStorage (5-10MB limit in most browsers). No doc addresses what happens when the limit is approached or exceeded.
