import { ref, watch } from 'vue'
import { getSettings, saveSettings } from '@/infrastructure/storage.service'
import { type LayoutMode } from '@/domain/settings.schema'

/**
 * Composable for accessing and managing user settings.
 * @returns Object containing settings refs and update methods
 */
export function useSettings() {
  const settings = getSettings()

  const language = ref(settings.language)
  const preferredRegion = ref(settings.preferredRegion)
  const layoutMode = ref<LayoutMode>(settings.layoutMode)
  const theme = ref(settings.theme)
  const defaultHomeSection = ref(settings.defaultHomeSection)

  // Watch and persist settings
  watch(
    [language, preferredRegion, layoutMode, theme, defaultHomeSection],
    ([newLang, newRegion, newLayout, newTheme, newHome]) => {
      const current = getSettings()
      saveSettings({
        ...current,
        language: newLang,
        preferredRegion: newRegion,
        layoutMode: newLayout as LayoutMode,
        theme: newTheme as 'dark' | 'light',
        defaultHomeSection: newHome as 'trending' | 'popular' | 'search',
      })
    },
  )

  return {
    language,
    preferredRegion,
    layoutMode,
    theme,
    defaultHomeSection,
  }
}
