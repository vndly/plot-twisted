import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStats } from '@/application/use-stats'
import { useLibraryEntries } from '@/application/use-library-entries'
import { useGenres } from '@/application/use-genres'
import { useSettings } from '@/application/use-settings'
import { ref, type Ref } from 'vue'

// Mock dependencies
vi.mock('@/application/use-library-entries', () => ({
  useLibraryEntries: vi.fn(),
}))

vi.mock('@/application/use-genres', () => ({
  useGenres: vi.fn(),
}))

vi.mock('@/application/use-settings', () => ({
  useSettings: vi.fn(),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: { value: 'en' },
  }),
}))

describe('useStats', () => {
  const mockEntries = [
    {
      id: 1,
      status: 'watched',
      rating: 5,
      runtime: 120,
      genreIds: [28],
      watchDates: ['2026-01-01'],
      title: 'A',
    },
  ]

  const mockGenres = [{ id: 28, name: 'Action' }]

  beforeEach(() => {
    vi.mocked(useLibraryEntries).mockReturnValue({
      allEntries: ref(mockEntries) as Ref<any[]>,
      entries: ref([]) as Ref<any[]>,
      refresh: vi.fn(),
      getEntriesByStatus: vi.fn(),
      getEntriesByList: vi.fn(),
    })

    vi.mocked(useGenres).mockReturnValue({
      genres: ref(mockGenres) as Ref<any[]>,
      loading: ref(false),
      error: ref(null),
      fetchGenres: vi.fn(),
    })

    vi.mocked(useSettings).mockReturnValue({
      language: ref('en'),
    } as any)
  })

  it('computes metrics correctly', () => {
    const { metrics } = useStats()
    expect(metrics.value.totalWatched).toBe(1)
    expect(metrics.value.averageRating).toBe(5)
    expect(metrics.value.totalWatchTimeMinutes).toBe(120)
  })

  it('resolves genre names for distribution', () => {
    const { genreDistribution } = useStats()
    expect(genreDistribution.value[0].name).toBe('Action')
    expect(genreDistribution.value[0].count).toBe(1)
  })

  it('formats chart data', () => {
    const { genreChartData, monthlyChartData } = useStats()

    expect(genreChartData.value.labels).toContain('Action')
    expect(genreChartData.value.datasets[0].data).toContain(1)

    expect(monthlyChartData.value.labels.length).toBe(12)
    expect(monthlyChartData.value.datasets[0].data[0]).toBe(1) // Jan 2026
  })

  it('triggers genre fetch when language changes', async () => {
    const fetchGenres = vi.fn()
    const language = ref('en')
    vi.mocked(useGenres).mockReturnValue({
      genres: ref(mockGenres) as Ref<any[]>,
      loading: ref(false),
      error: ref(null),
      fetchGenres,
    })
    vi.mocked(useSettings).mockReturnValue({ language } as any)

    useStats()

    expect(fetchGenres).toHaveBeenCalledWith('en')

    language.value = 'fr'
    // watchEffect should trigger
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(fetchGenres).toHaveBeenCalledWith('fr')
  })
})
