import { ref } from 'vue'
import { getMovieGenres, getTvGenres } from '@/infrastructure/provider.client'
import { Genre } from '@/domain/shared.schema'

const genresCache = ref<Genre[]>([])
const cachedLanguage = ref<string | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)

/**
 * Composable for fetching and accessing genres.
 * Caches genres in memory for the session.
 */
export function useGenres() {
  /**
   * Fetches genres from TMDB if not already cached for the current language.
   * @param language - ISO 639-1 language code
   */
  const fetchGenres = async (language: string) => {
    if (genresCache.value.length > 0 && cachedLanguage.value === language) return

    loading.value = true
    error.value = null
    try {
      const [movieGenresRes, tvGenresRes] = await Promise.all([
        getMovieGenres(language),
        getTvGenres(language),
      ])

      const merged = [...movieGenresRes.genres, ...tvGenresRes.genres]
      const unique = Array.from(new Map(merged.map((g) => [g.id, g])).values())

      genresCache.value = unique.sort((a, b) => a.name.localeCompare(b.name))
      cachedLanguage.value = language
    } catch (e) {
      console.error('Failed to fetch genres:', e)
      error.value = e instanceof Error ? e : new Error('Failed to fetch genres')
    } finally {
      loading.value = false
    }
  }

  return {
    genres: genresCache,
    loading,
    error,
    fetchGenres,
  }
}
