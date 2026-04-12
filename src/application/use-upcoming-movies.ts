import { ref, watchEffect, computed } from 'vue'
import { getUpcomingMovies } from '@/infrastructure/provider.client'
import { useSettings } from '@/application/use-settings'
import { getCalendarDays, groupMoviesByDate } from '@/domain/calendar.logic'
import type { MovieListItem } from '@/domain/movie.schema'

/**
 * Composable to fetch and manage upcoming movies for a specific month.
 * Supports multi-page fetching to ensure all movies for the month are retrieved.
 * @param year - The full year
 * @param month - The 0-indexed month
 * @returns Reactive state for movies, loading, and error
 */
export function useUpcomingMovies(year: number, month: number) {
  const movies = ref<MovieListItem[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const { language, preferredRegion } = useSettings()

  /**
   * Calendar grid days including padding for the current month.
   */
  const calendarDays = computed(() => getCalendarDays(year, month))

  /**
   * Movies grouped by their release date "YYYY-MM-DD".
   */
  const moviesByDate = computed(() => groupMoviesByDate(movies.value))

  const fetchData = async () => {
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
          return y === year && m - 1 === month
        })

        allMovies.push(...filtered)
        totalPages = response.total_pages
        currentPage++

        // Safety break: stop if we have enough or if totalPages is huge
        const lastMovieDate = response.results[response.results.length - 1]?.release_date
        if (lastMovieDate) {
          const [ly, lm] = lastMovieDate.split('-').map(Number)
          // If the last movie in the response is already in a future month, we can stop
          if (ly > year || (ly === year && lm - 1 > month)) {
            break
          }
        }
      } while (currentPage <= totalPages && currentPage <= 5) // Cap at 5 pages for safety

      movies.value = allMovies
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Failed to fetch upcoming movies')
    } finally {
      loading.value = false
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
