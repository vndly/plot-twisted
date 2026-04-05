import { ref, computed } from 'vue'
import type { LibraryEntry, WatchStatus } from '@/domain/library.schema'
import { getAllLibraryEntries } from '@/infrastructure/storage.service'

/**
 * Composable for accessing and filtering all library entries.
 * @returns Object containing all entries and methods to filter them
 */
export function useLibraryEntries() {
  const allEntries = ref<LibraryEntry[]>(getAllLibraryEntries())

  const entries = computed(() => allEntries.value)

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

  /**
   * Filters entries by a custom list ID.
   * @param listId - The UUID of the custom list
   * @returns Array of filtered entries
   */
  const getEntriesByList = (listId: string) => {
    return allEntries.value.filter((entry) => entry.lists.includes(listId))
  }

  return {
    entries,
    refresh,
    getEntriesByStatus,
    getEntriesByList,
  }
}
