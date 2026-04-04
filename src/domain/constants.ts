/** Auto-dismiss timeout for toast notifications (in milliseconds). */
export const TOAST_DISMISS_MS = 4000

/** Maximum number of toasts visible simultaneously. Oldest is evicted when exceeded. */
export const MAX_VISIBLE_TOASTS = 5

/** Maximum number of retry attempts for rate-limited API requests. */
export const MAX_RETRY_ATTEMPTS = 3

/** Base delay in milliseconds for exponential backoff retry. */
export const RETRY_BASE_DELAY_MS = 1000

/** Debounce delay for search input (in milliseconds). */
export const SEARCH_DEBOUNCE_MS = 300

/** Minimum query length to trigger a search. */
export const MIN_SEARCH_QUERY_LENGTH = 1

/** Base URL for TMDB images. */
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

/** Available image sizes for different contexts. */
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
  },
} as const
