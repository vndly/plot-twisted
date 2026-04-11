import { ref, computed } from 'vue'
import { LibraryFilterState, DEFAULT_LIBRARY_FILTER_STATE } from '@/domain/filter.schema'
import { countActiveFilters } from '@/domain/filter.logic'

/**
 * Composable for managing library-specific filter state.
 */
export function useLibraryFilters() {
  const filters = ref<LibraryFilterState>({ ...DEFAULT_LIBRARY_FILTER_STATE })

  const activeFilterCount = computed(() => countActiveFilters(filters.value))

  const clearFilters = () => {
    filters.value = { ...DEFAULT_LIBRARY_FILTER_STATE }
  }

  return {
    filters,
    activeFilterCount,
    clearFilters,
  }
}
