import { ref, watchEffect, computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getUpcomingMovies } from '@/infrastructure/provider.client'
import { useSettings } from '@/application/use-settings'
import { getCalendarDays, groupMoviesByDate } from '@/domain/calendar.logic'
import type { MovieListItem } from '@/domain/movie.schema'

/**
 * Composable to fetch and manage upcoming movies for a specific month.
 * Supports multi-page fetching to ensure all movies for the month are retrieved.
 * @param year - The full year, passed as a number or reactive source
 * @param month - The 0-indexed month, passed as a number or reactive source
 * @returns Reactive state for movies, loading, and error
 */
export function useUpcomingMovies(year: MaybeRefOrGetter<number>, month: MaybeRefOrGetter<number>) {
  const movies = ref<MovieListItem[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const { language, preferredRegion } = useSettings()
  let requestId = 0

  /**
   * Calendar grid days including padding for the current month.
   */
  const calendarDays = computed(() => getCalendarDays(toValue(year), toValue(month)))

  /**
   * Movies grouped by their release date "YYYY-MM-DD".
   */
  const moviesByDate = computed(() => groupMoviesByDate(movies.value))

  const fetchData = async () => {
    const activeRequestId = ++requestId
    const targetYear = toValue(year)
    const targetMonth = toValue(month)

    loading.value = true
    error.value = null
    movies.value = []

    try {
      let currentPage = 1
      let totalPages = 1
      const allMovies: MovieListItem[] = []

      // Multi-page fetching logic (FR-06-04)
      do {
        const response = await getUpcomingMovies(language.value, preferredRegion.value, currentPage)

        // Filter movies to only include those in the target month (optimization/sanity check)
        // Fix: Use string splitting to avoid timezone shifts with new Date(isoString)
        const filtered = response.results.filter((movie) => {
          if (!movie.release_date) return false
          const [y, m] = movie.release_date.split('-').map(Number)
          return y === targetYear && m - 1 === targetMonth
        })

        allMovies.push(...filtered)
        totalPages = response.total_pages
        currentPage++

        // Safety break: stop if we have enough or if totalPages is huge
        const lastMovieDate = response.results[response.results.length - 1]?.release_date
        if (lastMovieDate) {
          const [ly, lm] = lastMovieDate.split('-').map(Number)
          // If the last movie in the response is already in a future month, we can stop
          if (ly > targetYear || (ly === targetYear && lm - 1 > targetMonth)) {
            break
          }
        }
      } while (currentPage <= totalPages && currentPage <= 5) // Cap at 5 pages for safety

      if (activeRequestId === requestId) {
        movies.value = allMovies
      }
    } catch (e) {
      if (activeRequestId === requestId) {
        error.value = e instanceof Error ? e : new Error('Failed to fetch upcoming movies')
      }
    } finally {
      if (activeRequestId === requestId) {
        loading.value = false
      }
    }
  }

  // Refetch when year, month, or settings change
  watchEffect(() => {
    fetchData()
  })

  return {
    movies,
    calendarDays,
    moviesByDate,
    loading,
    error,
    retry: fetchData,
  }
}
