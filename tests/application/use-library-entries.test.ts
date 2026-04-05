import { describe, it, expect, beforeEach } from 'vitest'
import { useLibraryEntries } from '@/application/use-library-entries'
import { saveLibraryEntry } from '@/infrastructure/storage.service'
import type { LibraryEntry } from '@/domain/library.schema'

describe('useLibraryEntries', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const createEntry = (overrides: Partial<LibraryEntry> = {}): LibraryEntry => ({
    id: 1,
    mediaType: 'movie',
    title: 'Fight Club',
    posterPath: '/poster.jpg',
    rating: 0,
    favorite: false,
    status: 'none',
    lists: [],
    tags: [],
    notes: '',
    watchDates: [],
    addedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  })

  describe('getAllEntries', () => {
    it('returns all entries in the library', () => {
      // Arrange
      saveLibraryEntry(createEntry({ id: 1, title: 'Entry 1' }))
      saveLibraryEntry(createEntry({ id: 2, title: 'Entry 2' }))

      // Act
      const { entries } = useLibraryEntries()

      // Assert
      expect(entries.value).toHaveLength(2)
    })
  })

  describe('getEntriesByStatus', () => {
    it('returns entries filtered by status (L-01, L-02)', () => {
      // Arrange
      saveLibraryEntry(createEntry({ id: 1, status: 'watchlist' }))
      saveLibraryEntry(createEntry({ id: 2, status: 'watched' }))
      saveLibraryEntry(createEntry({ id: 3, status: 'watchlist' }))

      // Act
      const { getEntriesByStatus } = useLibraryEntries()
      const watchlist = getEntriesByStatus('watchlist')
      const watched = getEntriesByStatus('watched')

      // Assert
      expect(watchlist).toHaveLength(2)
      expect(watched).toHaveLength(1)
    })
  })

  describe('getEntriesByList', () => {
    it('returns entries filtered by list ID (L-05)', () => {
      // Arrange
      saveLibraryEntry(createEntry({ id: 1, lists: ['list-1'] }))
      saveLibraryEntry(createEntry({ id: 2, lists: ['list-1', 'list-2'] }))
      saveLibraryEntry(createEntry({ id: 3, lists: ['list-2'] }))

      // Act
      const { getEntriesByList } = useLibraryEntries()
      const list1 = getEntriesByList('list-1')
      const list2 = getEntriesByList('list-2')

      // Assert
      expect(list1).toHaveLength(2)
      expect(list2).toHaveLength(2)
    })
  })
})
