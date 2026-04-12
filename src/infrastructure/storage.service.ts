import type { LibraryEntry, MediaType, List } from '@/domain/library.schema'
import { LibraryEntrySchema, ListSchema } from '@/domain/library.schema'
import type { Settings, ExportData } from '@/domain/settings.schema'
import { SettingsSchema, DEFAULT_SETTINGS, ImportDataSchema } from '@/domain/settings.schema'

/** Storage key for the library data in localStorage. */
export const STORAGE_KEY = 'plot-twisted-library'

/** Storage key for custom lists in localStorage. */
export const STORAGE_KEY_LISTS = 'plot-twisted-lists'

/** Storage key for settings in localStorage. */
export const STORAGE_KEY_SETTINGS = 'plot-twisted-settings'

/**
 * Retrieves user settings from localStorage.
 * Handles migration from standalone layoutMode key.
 * @returns Validated user settings
 */
export function getSettings(): Settings {
  const stored = localStorage.getItem(STORAGE_KEY_SETTINGS)

  let settings: Partial<Settings> = {}

  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      const result = SettingsSchema.safeParse(parsed)
      if (result.success) {
        return result.data
      }
      settings = parsed
    } catch {
      // Fall through to defaults/migration
    }
  }

  // Handle migration of standalone layoutMode
  const standaloneLayout = localStorage.getItem('layoutMode')
  if (standaloneLayout === 'grid' || standaloneLayout === 'list') {
    settings.layoutMode = standaloneLayout
    // Clean up standalone key
    localStorage.removeItem('layoutMode')
  }

  const merged = { ...DEFAULT_SETTINGS, ...settings }
  const result = SettingsSchema.safeParse(merged)

  if (result.success) {
    // Save migrated settings back to storage
    saveSettings(result.data)
    return result.data
  }

  return DEFAULT_SETTINGS
}

/**
 * Saves user settings to localStorage.
 * @param settings - The settings object to save
 */
export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
}

/**
 * Retrieves all library entries from localStorage.
 * @returns Array of validated library entries, or empty array if none exist
 */
export function getAllLibraryEntries(): LibraryEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return []
    }

    // Validate each entry, filter out invalid ones
    return parsed.filter((entry) => {
      const result = LibraryEntrySchema.safeParse(entry)
      return result.success
    })
  } catch {
    return []
  }
}

/**
 * Retrieves a specific library entry by ID and media type.
 * @param id - The TMDB ID of the movie or TV show
 * @param mediaType - The type of media ('movie' or 'tv')
 * @returns The library entry if found, or null
 */
export function getLibraryEntry(id: number, mediaType: MediaType): LibraryEntry | null {
  const entries = getAllLibraryEntries()
  return entries.find((entry) => entry.id === id && entry.mediaType === mediaType) ?? null
}

/**
 * Saves or updates a library entry in localStorage.
 * If an entry with the same ID and media type exists, it will be replaced.
 * @param entry - The library entry to save
 */
export function saveLibraryEntry(entry: LibraryEntry): void {
  const entries = getAllLibraryEntries()
  const existingIndex = entries.findIndex(
    (e) => e.id === entry.id && e.mediaType === entry.mediaType,
  )

  if (existingIndex >= 0) {
    entries[existingIndex] = entry
  } else {
    entries.push(entry)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

/**
 * Removes a library entry from localStorage.
 * @param id - The TMDB ID of the movie or TV show
 * @param mediaType - The type of media ('movie' or 'tv')
 */
export function removeLibraryEntry(id: number, mediaType: MediaType): void {
  const entries = getAllLibraryEntries()
  const filtered = entries.filter((e) => !(e.id === id && e.mediaType === mediaType))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

/**
 * Retrieves all custom lists from localStorage.
 * @returns Array of validated lists, or empty array if none exist
 */
export function getAllLists(): List[] {
  const stored = localStorage.getItem(STORAGE_KEY_LISTS)
  if (!stored) {
    return []
  }

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((list) => {
      const result = ListSchema.safeParse(list)
      return result.success
    })
  } catch {
    return []
  }
}

/**
 * Saves or updates a custom list in localStorage.
 * @param list - The list to save
 */
export function saveList(list: List): void {
  const lists = getAllLists()
  const existingIndex = lists.findIndex((l) => l.id === list.id)

  if (existingIndex >= 0) {
    lists[existingIndex] = list
  } else {
    lists.push(list)
  }

  localStorage.setItem(STORAGE_KEY_LISTS, JSON.stringify(lists))
}

/**
 * Removes a custom list from localStorage.
 * @param id - The UUID of the list to remove
 */
export function removeList(id: string): void {
  const lists = getAllLists()
  const filtered = lists.filter((l) => l.id !== id)
  localStorage.setItem(STORAGE_KEY_LISTS, JSON.stringify(filtered))
}

/**
 * Retrieves library entries associated with a specific list ID.
 * @param listId - The UUID of the custom list
 * @returns Array of associated library entries
 */
export function getListEntries(listId: string): LibraryEntry[] {
  const entries = getAllLibraryEntries()
  return entries.filter((entry) => entry.lists.includes(listId))
}

/**
 * Updates the associated lists for a specific library entry.
 * @param id - TMDB ID
 * @param mediaType - Media type
 * @param listIds - New array of list IDs
 */
export function updateEntryLists(id: number, mediaType: MediaType, listIds: string[]): void {
  const entry = getLibraryEntry(id, mediaType)
  if (entry) {
    saveLibraryEntry({ ...entry, lists: listIds })
  }
}

/**
 * Removes a list ID from all library entries that contain it.
 * Used for maintaining integrity when a list is deleted.
 * @param listId - The UUID of the deleted list
 */
export function removeListFromAllEntries(listId: string): void {
  const entries = getAllLibraryEntries()
  const updated = entries.map((entry) => {
    if (entry.lists.includes(listId)) {
      return { ...entry, lists: entry.lists.filter((id) => id !== listId) }
    }
    return entry
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

/**
 * Generates an export object containing all user data.
 * @returns The export data object
 */
export async function exportData(): Promise<ExportData> {
  const libraryEntries = getAllLibraryEntries()
  const lists = getAllLists()
  const settings = getSettings()

  // Convert arrays to records as expected by schema
  const libraryRecord: Record<string, LibraryEntry> = {}
  libraryEntries.forEach((entry) => {
    libraryRecord[`${entry.id}-${entry.mediaType}`] = entry
  })

  const listRecord: Record<string, List> = {}
  lists.forEach((list) => {
    listRecord[list.id] = list
  })

  // Extract all unique tags
  const tags = new Set<string>()
  libraryEntries.forEach((entry) => {
    entry.tags.forEach((tag) => tags.add(tag))
  })

  const exportData: ExportData = {
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    schemaVersion: 1,
    library: libraryRecord,
    lists: listRecord,
    tags: Array.from(tags).sort(),
    settings,
  }

  return exportData
}

/**
 * Imports user data from a provided object using the specified strategy.
 * @param data - The data to import (untrusted)
 * @param strategy - Whether to 'merge' with existing data or 'overwrite' it
 */
export async function importData(data: unknown, strategy: 'merge' | 'overwrite'): Promise<void> {
  // 1. Validate structure
  const result = ImportDataSchema.safeParse(data)
  if (!result.success) {
    throw new Error(`Invalid export data: ${result.error.message}`)
  }

  const validatedData = result.data

  // 2. Safety Export for overwrite strategy
  if (strategy === 'overwrite') {
    const backup = await exportData()
    downloadFile(
      JSON.stringify(backup, null, 2),
      `plot-twisted-backup-${new Date().toISOString()}.json`,
      'application/json',
    )
  }

  // 3. Process entries with sanitization
  const sanitizeEntry = (entry: LibraryEntry): LibraryEntry => ({
    ...entry,
    title: sanitize(entry.title),
    notes: sanitize(entry.notes),
    tags: entry.tags.map(sanitize),
  })

  const sanitizeList = (list: List): List => ({
    ...list,
    name: sanitize(list.name),
  })

  // 4. Apply strategy
  if (strategy === 'overwrite') {
    // Clear existing
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY_LISTS)
    localStorage.removeItem(STORAGE_KEY_SETTINGS)

    // Save imported
    const libraryEntries = Object.values(validatedData.library).map(sanitizeEntry)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(libraryEntries))

    const lists = Object.values(validatedData.lists).map(sanitizeList)
    localStorage.setItem(STORAGE_KEY_LISTS, JSON.stringify(lists))

    saveSettings(validatedData.settings)
  } else {
    // Merge
    const importedLibrary = Object.values(validatedData.library).map(sanitizeEntry)
    importedLibrary.forEach((entry) => saveLibraryEntry(entry))

    const importedLists = Object.values(validatedData.lists).map(sanitizeList)
    importedLists.forEach((list) => saveList(list))

    // Settings are ignored in merge strategy per requirements
  }
}

/**
 * Triggers a file download in the browser.
 * @param content - The string content of the file
 * @param fileName - The desired name for the downloaded file
 * @param contentType - The MIME type of the file
 */
export function downloadFile(content: string, fileName: string, contentType: string): void {
  const a = document.createElement('a')
  const file = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(file)
  a.href = url
  a.download = fileName
  a.click()
  // Give it a moment before revoking
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Parses a JSON file from a File object.
 * @param file - The browser File object
 * @returns The parsed data
 */
export async function parseFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        resolve(JSON.parse(content))
      } catch {
        reject(new Error('Invalid JSON format'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Simple sanitization to prevent XSS.
 * Trims and removes script-like tags.
 */
function sanitize(value: string): string {
  if (!value) return value
  return value.trim().replace(/<[^>]*>?/gm, '')
}
