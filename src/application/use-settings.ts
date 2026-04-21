import { ref, watch } from 'vue'
import {
  getSettings,
  saveSettings,
  exportData,
  importData,
  downloadFile,
  parseFile,
  clearAllData,
} from '@/infrastructure/storage.service'
import { type LayoutMode, type Settings } from '@/domain/settings.schema'

// Shared state for singleton behavior
const settings = getSettings()
const language = ref(settings.language)
const preferredRegion = ref(settings.preferredRegion)
const layoutMode = ref<LayoutMode>(settings.layoutMode)
const theme = ref(settings.theme)
const defaultHomeSection = ref(settings.defaultHomeSection)
const librarySortField = ref(settings.librarySortField)
const librarySortOrder = ref(settings.librarySortOrder)

/**
 * Synchronizes all reactive refs from a settings object.
 * @param newSettings - Settings to apply to local state
 */
function syncSettingsRefs(newSettings: Settings): void {
  language.value = newSettings.language
  preferredRegion.value = newSettings.preferredRegion
  layoutMode.value = newSettings.layoutMode
  theme.value = newSettings.theme
  defaultHomeSection.value = newSettings.defaultHomeSection
  librarySortField.value = newSettings.librarySortField
  librarySortOrder.value = newSettings.librarySortOrder
}

// Global watcher for persistence and UI state sync
// This runs once for the application lifecycle
watch(
  [
    language,
    preferredRegion,
    layoutMode,
    theme,
    defaultHomeSection,
    librarySortField,
    librarySortOrder,
  ],
  ([newLang, newRegion, newLayout, newTheme, newHome, newSortField, newSortOrder]) => {
    // 1. Persist to storage
    saveSettings({
      language: newLang,
      preferredRegion: newRegion,
      layoutMode: newLayout as LayoutMode,
      theme: newTheme as 'dark' | 'light',
      defaultHomeSection: newHome as 'trending' | 'popular' | 'search',
      librarySortField: newSortField as Settings['librarySortField'],
      librarySortOrder: newSortOrder as Settings['librarySortOrder'],
    })

    // 2. Sync browser/UI state
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      document.documentElement.lang = newLang
    }
  },
  { immediate: true },
)

/**
 * Composable for accessing and managing user settings.
 * Singleton pattern ensures all components share the same reactive state.
 * @returns Object containing settings refs and update methods
 */
export function useSettings() {
  /**
   * Triggers a library export and file download.
   */
  async function triggerExport() {
    const data = await exportData()
    const content = JSON.stringify(data, null, 2)
    const fileName = `plot-twisted-export-${new Date().toISOString().split('T')[0]}.json`
    downloadFile(content, fileName, 'application/json')
  }

  /**
   * Handles library import from a File object.
   * @param file - The JSON file to import
   * @param strategy - Merge or Overwrite strategy
   */
  async function handleImportFile(file: File, strategy: 'merge' | 'overwrite') {
    const data = await parseFile(file)
    await importLibrary(data, strategy)
  }

  /**
   * Imports library data from a source object.
   * @param data - Raw data to import
   * @param strategy - Merge or Overwrite strategy
   */
  async function importLibrary(data: unknown, strategy: 'merge' | 'overwrite') {
    await importData(data, strategy)

    // Refresh local refs if overwrite happened
    if (strategy === 'overwrite') {
      syncSettingsRefs(getSettings())
    }
  }

  /**
   * Deletes all locally stored user data and resets settings refs.
   */
  function deleteAllData() {
    clearAllData()
    syncSettingsRefs(getSettings())
  }

  return {
    language,
    preferredRegion,
    layoutMode,
    theme,
    defaultHomeSection,
    librarySortField,
    librarySortOrder,
    triggerExport,
    handleImportFile,
    importLibrary,
    deleteAllData,
  }
}
