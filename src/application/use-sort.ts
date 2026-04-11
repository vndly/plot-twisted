import { ref, watch } from 'vue'
import { SortField, SortOrder } from '@/domain/filter.schema'
import { getSettings, saveSettings } from '@/infrastructure/storage.service'

/**
 * Composable for managing library sort state.
 */
export function useSort() {
  const settings = getSettings()

  const sortField = ref<SortField>(settings.librarySortField || 'dateAdded')
  const sortOrder = ref<SortOrder>(settings.librarySortOrder || 'desc')

  // Persist sort settings whenever they change
  watch([sortField, sortOrder], ([newField, newOrder]) => {
    const currentSettings = getSettings()
    saveSettings({
      ...currentSettings,
      librarySortField: newField,
      librarySortOrder: newOrder,
    })
  })

  return {
    sortField,
    sortOrder,
  }
}
