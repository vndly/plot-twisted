import { ref } from 'vue'

/**
 * Composable for accessing user settings.
 * Currently provides a stub implementation with default values.
 * @returns Object containing language setting
 */
export function useSettings() {
  const language = ref('en')

  return {
    language,
  }
}
