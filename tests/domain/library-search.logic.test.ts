import { describe, it, expect } from 'vitest'
import {
  filterLibraryEntriesBySearchQuery,
  matchesLibrarySearchQuery,
} from '@/domain/library-search.logic'
import { type LibraryEntry } from '@/domain/library.schema'

const mockEntry = (overrides: Partial<LibraryEntry> = {}): LibraryEntry => ({
  id: 1,
  mediaType: 'movie',
  title: 'Batman',
  posterPath: null,
  rating: 0,
  favorite: false,
  status: 'watchlist',
  tags: [],
  notes: '',
  watchDates: [],
  addedAt: new Date().toISOString(),
  ...overrides,
})

describe('matchesLibrarySearchQuery', () => {
  it('matches title case-insensitively', () => {
    const entry = mockEntry({ title: 'The Dark Knight' })
    expect(matchesLibrarySearchQuery(entry, 'dark')).toBe(true)
    expect(matchesLibrarySearchQuery(entry, 'DARK')).toBe(true)
  })

  it('matches tags case-insensitively', () => {
    const entry = mockEntry({ tags: ['Action', 'DC'] })
    expect(matchesLibrarySearchQuery(entry, 'action')).toBe(true)
    expect(matchesLibrarySearchQuery(entry, 'dc')).toBe(true)
  })

  it('matches notes case-insensitively', () => {
    const entry = mockEntry({ notes: 'Great movie about a bat.' })
    expect(matchesLibrarySearchQuery(entry, 'bat')).toBe(true)
    expect(matchesLibrarySearchQuery(entry, 'GREAT')).toBe(true)
  })

  it('returns true for empty query', () => {
    const entry = mockEntry()
    expect(matchesLibrarySearchQuery(entry, '')).toBe(true)
  })

  it('returns false when no fields match', () => {
    const entry = mockEntry({ title: 'Arrival', tags: ['Sci-Fi'], notes: 'Aliens' })
    expect(matchesLibrarySearchQuery(entry, 'batman')).toBe(false)
  })

  it('matches partial strings', () => {
    const entry = mockEntry({ title: 'Batman' })
    expect(matchesLibrarySearchQuery(entry, 'bat')).toBe(true)
    expect(matchesLibrarySearchQuery(entry, 'man')).toBe(true)
  })
})

describe('filterLibraryEntriesBySearchQuery', () => {
  it('filters a list of entries', () => {
    const entries = [
      mockEntry({ id: 1, title: 'Batman' }),
      mockEntry({ id: 2, title: 'Superman' }),
      mockEntry({ id: 3, title: 'Wonder Woman' }),
    ]
    const result = filterLibraryEntriesBySearchQuery(entries, 'man')
    expect(result).toHaveLength(3)

    const result2 = filterLibraryEntriesBySearchQuery(entries, 'bat')
    expect(result2).toHaveLength(1)
    expect(result2[0].title).toBe('Batman')
  })

  it('performance check: filters 500 entries in < 50ms', () => {
    const entries = Array.from({ length: 500 }, (_, i) =>
      mockEntry({
        id: i,
        title: `Movie ${i}`,
        notes: i === 499 ? 'target' : '',
      }),
    )

    const start = performance.now()
    const result = filterLibraryEntriesBySearchQuery(entries, 'target')
    const end = performance.now()

    expect(result).toHaveLength(1)
    expect(end - start).toBeLessThan(50)
  })
})
