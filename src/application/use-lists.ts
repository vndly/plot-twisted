import { ref, computed } from 'vue'
import type { List } from '@/domain/library.schema'
import {
  getAllLists,
  saveList,
  removeList,
  removeListFromAllEntries,
} from '@/infrastructure/storage.service'

/**
 * Composable for managing custom user lists.
 * @returns Object containing lists and methods to manage them
 */
export function useLists() {
  const internalLists = ref<List[]>(getAllLists())

  const lists = computed(() => internalLists.value)

  /**
   * Creates a new custom list.
   * @param name - The name of the list
   */
  const createList = (name: string) => {
    const trimmedName = name.trim()
    if (!trimmedName) return

    // Check for duplicates (case-insensitive)
    const exists = internalLists.value.some(
      (l) => l.name.toLowerCase() === trimmedName.toLowerCase(),
    )
    if (exists) return

    const newList: List = {
      id: crypto.randomUUID(),
      name: trimmedName,
      createdAt: new Date().toISOString(),
    }

    saveList(newList)
    internalLists.value = getAllLists()
  }

  /**
   * Renames an existing list.
   * @param id - The UUID of the list
   * @param newName - The new name for the list
   */
  const renameList = (id: string, newName: string) => {
    const trimmedName = newName.trim()
    if (!trimmedName) return

    const list = internalLists.value.find((l) => l.id === id)
    if (!list) return

    // Check for duplicates (case-insensitive) excluding itself
    const exists = internalLists.value.some(
      (l) => l.id !== id && l.name.toLowerCase() === trimmedName.toLowerCase(),
    )
    if (exists) return

    saveList({ ...list, name: trimmedName })
    internalLists.value = getAllLists()
  }

  /**
   * Deletes a custom list and removes its association from all entries.
   * @param id - The UUID of the list
   */
  const deleteList = (id: string) => {
    removeList(id)
    removeListFromAllEntries(id)
    internalLists.value = getAllLists()
  }

  return {
    lists,
    createList,
    renameList,
    deleteList,
  }
}
