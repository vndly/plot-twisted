import { ref, computed, type Ref } from 'vue'
import type { LibraryEntry, WatchStatus } from '@/domain/library.schema'
import type { LibraryFilterState, SortField, SortOrder } from '@/domain/filter.schema'
import { getAllLibraryEntries } from '@/infrastructure/storage.service'
import {
  toLibraryViewItem,
  matchesLibraryFilters,
  getLibraryComparator,
  type LibraryViewItem,
} from '@/domain/filter.logic'
import {
  matchesLibrarySearchQuery,
  normalizeLibrarySearchQuery,
} from '@/domain/library-search.logic'

/**
 * Composable for accessing, filtering, and sorting library entries.
 * @param filters - Optional reactive library filter state
 * @param sortField - Optional reactive sort field
 * @param sortOrder - Optional reactive sort order
 * @param searchQuery - Optional reactive search query
 * @returns Object containing all entries and methods to filter them
 */
export function useLibraryEntries(
  filters?: Ref<LibraryFilterState>,
  sortField?: Ref<SortField>,
  sortOrder?: Ref<SortOrder>,
  searchQuery?: Ref<string>,
) {
  const allEntries = ref<LibraryEntry[]>(getAllLibraryEntries())

  /**
   * Computed list of normalized library view items, filtered and sorted.
   */
  const entries = computed<LibraryViewItem[]>(() => {
    let rawEntries = allEntries.value

    // Apply search if provided
    if (searchQuery?.value) {
      rawEntries = rawEntries.filter((entry) =>
        matchesLibrarySearchQuery(entry, normalizeLibrarySearchQuery(searchQuery.value)),
      )
    }

    let items = rawEntries.map(toLibraryViewItem)

    // Apply filters if provided
    if (filters?.value) {
      items = items.filter((item) => matchesLibraryFilters(item, filters.value))
    }

    // Apply sorting if provided
    if (sortField?.value && sortOrder?.value) {
      items.sort(getLibraryComparator(sortField.value, sortOrder.value))
    } else {
      // Default sort by dateAdded desc
      items.sort(getLibraryComparator('dateAdded', 'desc'))
    }

    return items
  })

  /**
   * Refreshes entries from storage.
   */
  const refresh = () => {
    allEntries.value = getAllLibraryEntries()
  }

  /**
   * Filters entries by their watch status.
   * @param status - The watch status to filter by
   * @returns Array of filtered entries
   */
  const getEntriesByStatus = (status: WatchStatus) => {
    return allEntries.value.filter((entry) => entry.status === status)
  }

  return {
    allEntries,
    entries,
    refresh,
    getEntriesByStatus,
  }
}
