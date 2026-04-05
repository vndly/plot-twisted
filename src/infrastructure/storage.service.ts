import type { LibraryEntry, MediaType, List } from '@/domain/library.schema'
import { LibraryEntrySchema, ListSchema } from '@/domain/library.schema'

/** Storage key for the library data in localStorage. */
export const STORAGE_KEY = 'plot-twisted-library'

/** Storage key for custom lists in localStorage. */
export const STORAGE_KEY_LISTS = 'plot-twisted-lists'

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
