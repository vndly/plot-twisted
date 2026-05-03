import { ref, computed, watch, onUnmounted } from 'vue'

const SEARCH_DEBOUNCE_MS = 300

/**
 * Composable for managing volatile library search state with debouncing.
 */
export function useLibrarySearch() {
  const query = ref('')
  const appliedQuery = ref('')
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null

  const hasSearchQuery = computed(() => query.value.trim().length > 0)

  const clearSearch = () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
      debounceTimeout = null
    }
    query.value = ''
    appliedQuery.value = ''
  }

  watch(query, (newQuery) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    if (!newQuery.trim()) {
      appliedQuery.value = ''
      return
    }

    debounceTimeout = setTimeout(() => {
      appliedQuery.value = newQuery
    }, SEARCH_DEBOUNCE_MS)
  })

  onUnmounted(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
  })

  return {
    query,
    appliedQuery,
    hasSearchQuery,
    clearSearch,
  }
}
