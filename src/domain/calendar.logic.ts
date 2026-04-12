import type { MovieListItem } from '@/domain/movie.schema'

/**
 * Returns an array of Date objects representing all days in the specified month.
 * @param year - The full year (e.g., 2026)
 * @param month - The 0-indexed month (0 = January, 1 = February, etc.)
 * @returns Array of Date objects
 */
export function getMonthDays(year: number, month: number): Date[] {
  const date = new Date(year, month, 1)
  const days: Date[] = []

  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return days
}

/**
 * Returns an array of Date objects for a full 7-column calendar grid.
 * Includes padding days from the previous and next months to complete rows.
 * @param year - The full year
 * @param month - The 0-indexed month
 * @param startOfWeek - The day to start the week (0 = Sunday, 1 = Monday). Defaults to 0.
 * @returns Array of Date objects for the grid
 */
export function getCalendarDays(year: number, month: number, startOfWeek = 0): Date[] {
  const days = getMonthDays(year, month)
  const firstDay = days[0]
  const lastDay = days[days.length - 1]

  // Add previous month's padding
  const firstDayOfWeek = firstDay.getDay()
  const paddingBefore = (firstDayOfWeek - startOfWeek + 7) % 7
  const result: Date[] = []

  for (let i = paddingBefore; i > 0; i--) {
    const d = new Date(firstDay)
    d.setDate(d.getDate() - i)
    result.push(d)
  }

  // Add current month's days
  result.push(...days)

  // Add next month's padding
  const lastDayOfWeek = lastDay.getDay()
  const paddingAfter = (6 - lastDayOfWeek + startOfWeek) % 7

  for (let i = 1; i <= paddingAfter; i++) {
    const d = new Date(lastDay)
    d.setDate(d.getDate() + i)
    result.push(d)
  }

  // Ensure grid always has 35 or 42 days (multiples of 7)
  // This is already handled by paddingAfter calculation.

  return result
}

/**
 * Groups movies by their release date.
 * @param movies - Array of MovieListItem objects
 * @returns Record where keys are "YYYY-MM-DD" and values are arrays of movies
 */
export function groupMoviesByDate(movies: MovieListItem[]): Record<string, MovieListItem[]> {
  return movies.reduce(
    (acc, movie) => {
      const date = movie.release_date
      if (!date) return acc

      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(movie)
      return acc
    },
    {} as Record<string, MovieListItem[]>,
  )
}

/**
 * Formats a Date object as a "YYYY-MM-DD" string in local time.
 * @param date - Date object
 * @returns Formatted string
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
