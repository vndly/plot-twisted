import type { LibraryEntry } from '@/domain/library.schema'

/**
 * Key metrics computed from the library entries.
 */
export interface KeyMetrics {
  totalWatched: number
  totalWatchlist: number
  averageRating: number
  totalWatchTimeMinutes: number
}

/**
 * Distribution of items per genre ID.
 */
export type GenreDistribution = Record<number, number>

/**
 * Monthly activity counts (month 0-11 as index).
 */
export type MonthlyActivity = Record<number, number>

/**
 * Computes key metrics from library entries.
 * (ST-01)
 */
export function calculateKeyMetrics(entries: LibraryEntry[]): KeyMetrics {
  const watched = entries.filter((e) => e.status === 'watched')
  const watchlist = entries.filter((e) => e.status === 'watchlist')

  const ratings = watched.filter((e) => e.rating > 0).map((e) => e.rating)
  const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

  const totalWatchTimeMinutes = watched.reduce((sum, e) => sum + (e.runtime || 0), 0)

  return {
    totalWatched: watched.length,
    totalWatchlist: watchlist.length,
    averageRating,
    totalWatchTimeMinutes,
  }
}

/**
 * Computes the distribution of watched items per genre.
 * (ST-02)
 */
export function calculateGenreDistribution(entries: LibraryEntry[]): GenreDistribution {
  const watched = entries.filter((e) => e.status === 'watched')
  const distribution: GenreDistribution = {}

  watched.forEach((entry) => {
    entry.genreIds?.forEach((genreId) => {
      distribution[genreId] = (distribution[genreId] || 0) + 1
    })
  })

  return distribution
}

/**
 * Computes the monthly activity for a specific year.
 * (ST-03)
 */
export function calculateMonthlyActivity(entries: LibraryEntry[], year: number): MonthlyActivity {
  const watched = entries.filter((e) => e.status === 'watched')
  const activity: MonthlyActivity = {}

  // Initialize all 12 months with 0
  for (let i = 0; i < 12; i++) {
    activity[i] = 0
  }

  watched.forEach((entry) => {
    entry.watchDates.forEach((dateStr) => {
      const date = new Date(dateStr)
      if (date.getFullYear() === year) {
        const month = date.getMonth()
        activity[month]++
      }
    })
  })

  return activity
}

/**
 * Filters and sorts the top rated watched items.
 * (ST-04)
 */
export function getTopRatedItems(entries: LibraryEntry[], limit = 10): LibraryEntry[] {
  return entries
    .filter((e) => e.status === 'watched' && e.rating > 0)
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating
      }
      return a.title.localeCompare(b.title)
    })
    .slice(0, limit)
}

/**
 * Formats minutes into a human-readable string (e.g., "5d 12h 30m").
 * (ST-01)
 */
export function formatWatchTime(totalMinutes: number): string {
  if (totalMinutes === 0) return '0m'

  const days = Math.floor(totalMinutes / (24 * 60))
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const minutes = totalMinutes % 60

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0 || (days === 0 && hours === 0)) parts.push(`${minutes}m`)

  return parts.join(' ')
}
