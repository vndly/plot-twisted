import { describe, it, expect, beforeEach, vi } from 'vitest';
import { exportData, importData } from '@/infrastructure/storage.service'

// Mocking global fetch for download trigger if needed, or window.URL
const createObjectURLMock = vi.fn()
const revokeObjectURLMock = vi.fn()
global.URL.createObjectURL = createObjectURLMock
global.URL.revokeObjectURL = revokeObjectURLMock

describe('storageService Import/Export', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  const validEntry = {
    id: 550,
    title: 'Fight Club',
    mediaType: 'movie',
    posterPath: '/pB8BM79vS6vMvMjnBhCHvDOD0vH.jpg',
    rating: 0,
    favorite: false,
    status: 'none',
    lists: [],
    tags: [],
    notes: '',
    watchDates: [],
    addedAt: new Date().toISOString(),
  }

  describe('exportData', () => {
    it('should generate a valid export object containing library, lists, tags, and settings', async () => {
      // Setup mock data in localStorage
      const mockSettings = {
        theme: 'dark',
        language: 'en',
        preferredRegion: 'US',
        layoutMode: 'grid',
        defaultHomeSection: 'trending',
        librarySortField: 'dateAdded',
        librarySortOrder: 'desc',
      }
      const mockLibrary = [validEntry]

      localStorage.setItem('plot-twisted-settings', JSON.stringify(mockSettings))
      localStorage.setItem('plot-twisted-library', JSON.stringify(mockLibrary))

      const exported = await exportData()

      expect(exported.exportVersion).toBe(1)
      expect(exported.schemaVersion).toBe(1)
      expect(exported.settings).toEqual(mockSettings)
      expect(Object.values(exported.library)).toHaveLength(1)
      expect(exported.exportedAt).toBeDefined()
    })
  })

  describe('importData', () => {
    const validExport = {
      exportVersion: 1,
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      library: { '550-movie': validEntry },
      lists: {},
      tags: ['action'],
      settings: {
        theme: 'light',
        language: 'es',
        preferredRegion: 'ES',
        layoutMode: 'list',
        defaultHomeSection: 'popular',
        librarySortField: 'dateAdded',
        librarySortOrder: 'desc',
      },
    }

    it('should overwrite existing data when strategy is "overwrite"', async () => {
      // Pre-fill storage
      localStorage.setItem(
        'plot-twisted-library',
        JSON.stringify([{ ...validEntry, id: 123, title: 'Old' }]),
      )

      await importData(validExport, 'overwrite')

      const storedLibrary = JSON.parse(localStorage.getItem('plot-twisted-library') || '[]')
      const storedSettings = JSON.parse(localStorage.getItem('plot-twisted-settings') || '{}')

      expect(storedLibrary).toHaveLength(1)
      expect(storedLibrary[0].title).toBe('Fight Club')
      expect(storedSettings.language).toBe('es')
    })

    it('should merge data when strategy is "merge"', async () => {
      // Pre-fill storage
      localStorage.setItem(
        'plot-twisted-library',
        JSON.stringify([{ ...validEntry, id: 123, title: 'Old' }]),
      )
      localStorage.setItem(
        'plot-twisted-settings',
        JSON.stringify({
          theme: 'dark',
          language: 'en',
          preferredRegion: 'US',
          layoutMode: 'grid',
          defaultHomeSection: 'trending',
          librarySortField: 'dateAdded',
          librarySortOrder: 'desc',
        }),
      )

      await importData(validExport, 'merge')

      const storedLibrary = JSON.parse(localStorage.getItem('plot-twisted-library') || '[]')
      const storedSettings = JSON.parse(localStorage.getItem('plot-twisted-settings') || '{}')

      // Library should have both
      expect(storedLibrary).toHaveLength(2);
      expect(storedLibrary.find((e: { id: number }) => e.id === 123)).toBeDefined();
      expect(storedLibrary.find((e: { id: number }) => e.id === 550)).toBeDefined();

      // Settings should NOT be overwritten in merge strategy
      expect(storedSettings.language).toBe('en');
      });

      it('should reject malformed JSON or invalid schema', async () => {
      const invalidData = { ...validExport, exportVersion: 'wrong' };

      await expect(importData(invalidData, 'merge')).rejects.toThrow();
      });

      it('should sanitize imported content to prevent XSS', async () => {
      const maliciousExport = {
        ...validExport,
        library: {
          '666-movie': {
            ...validEntry,
            id: 666,
            title: '<script>alert("xss")</script>Evil'
          }
        }
      };

      await importData(maliciousExport, 'merge');
      const storedLibrary = JSON.parse(localStorage.getItem('plot-twisted-library') || '[]');
      const entry = storedLibrary.find((e: { id: number }) => e.id === 666);

      expect(entry.title).not.toContain('<script>');
      });
  })
})
