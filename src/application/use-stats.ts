import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLibraryEntries } from '@/application/use-library-entries'
import { useGenres } from '@/application/use-genres'
import { useSettings } from '@/application/use-settings'
import {
  calculateKeyMetrics,
  calculateGenreDistribution,
  calculateMonthlyActivity,
  getTopRatedItems,
} from '@/domain/stats.logic'

/**
 * Composable for orchestrating statistics computation and chart data preparation.
 * (ST-05)
 */
export function useStats() {
  const { t, locale } = useI18n()
  const { allEntries } = useLibraryEntries()
  const { genres, fetchGenres, loading: genresLoading } = useGenres()
  const { language } = useSettings()

  // Ensure genres are loaded for the current language
  watchEffect(() => {
    fetchGenres(language.value)
  })

  /**
   * Key metrics like total watched, watchlist, avg rating, and watch time.
   */
  const metrics = computed(() => calculateKeyMetrics(allEntries.value))

  /**
   * Distribution of watched items per genre, mapped to genre names.
   */
  const genreDistribution = computed(() => {
    const dist = calculateGenreDistribution(allEntries.value)
    const genreMap = new Map(genres.value.map((g) => [g.id, g.name]))

    return Object.entries(dist)
      .map(([id, count]) => {
        const genreId = Number(id)
        return {
          id: genreId,
          name: genreMap.get(genreId) || `Genre ${genreId}`,
          count,
        }
      })
      .sort((a, b) => b.count - a.count)
  })

  /**
   * Monthly watch activity for the current calendar year.
   */
  const monthlyActivity = computed(() => {
    const currentYear = new Date().getFullYear()
    return calculateMonthlyActivity(allEntries.value, currentYear)
  })

  /**
   * Top 10 rated watched items.
   */
  const topRatedItems = computed(() => getTopRatedItems(allEntries.value))

  /**
   * Data formatted for the Genre distribution bar chart.
   */
  const genreChartData = computed(() => {
    const data = genreDistribution.value
    return {
      labels: data.map((d) => d.name),
      datasets: [
        {
          label: t('stats.charts.genre.label'),
          data: data.map((d) => d.count),
          backgroundColor: '#14b8a6', // teal-500
          borderRadius: 4,
        },
      ],
    }
  })

  /**
   * Data formatted for the Monthly activity bar chart.
   */
  const monthlyChartData = computed(() => {
    const activity = monthlyActivity.value
    const currentYear = new Date().getFullYear()

    const labels = Array.from({ length: 12 }, (_, i) => {
      // Use toLocaleString for localized month names based on current locale
      return new Date(currentYear, i, 1).toLocaleString(locale.value, { month: 'short' })
    })

    return {
      labels,
      datasets: [
        {
          label: t('stats.charts.monthly.label'),
          data: Object.values(activity),
          backgroundColor: '#14b8a6', // teal-500
          borderRadius: 4,
        },
      ],
    }
  })

  return {
    metrics,
    genreDistribution,
    monthlyActivity,
    topRatedItems,
    genreChartData,
    monthlyChartData,
    genresLoading,
  }
}
