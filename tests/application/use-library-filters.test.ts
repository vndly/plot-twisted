import { describe, it, expect } from 'vitest'
import { useLibraryFilters } from '@/application/use-library-filters'
import { DEFAULT_LIBRARY_FILTER_STATE } from '@/domain/filter.schema'

describe('useLibraryFilters', () => {
  it('initializes with default filters', () => {
    const { filters } = useLibraryFilters()
    expect(filters.value).toEqual(DEFAULT_LIBRARY_FILTER_STATE)
  })

  it('updates activeFilterCount correctly', () => {
    const { filters, activeFilterCount } = useLibraryFilters()
    expect(activeFilterCount.value).toBe(0)

    filters.value.genres = [28]
    expect(activeFilterCount.value).toBe(1)

    filters.value.mediaType = 'movie'
    expect(activeFilterCount.value).toBe(2)
  })

  it('clears filters to defaults', () => {
    const { filters, clearFilters } = useLibraryFilters()
    filters.value.genres = [28]
    filters.value.mediaType = 'movie'

    clearFilters()

    expect(filters.value).toEqual(DEFAULT_LIBRARY_FILTER_STATE)
  })
})
