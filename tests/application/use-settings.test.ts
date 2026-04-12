import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as storageService from '@/infrastructure/storage.service'

vi.mock('@/infrastructure/storage.service', async () => {
  const actual = await vi.importActual('@/infrastructure/storage.service')
  return {
    ...actual,
    getSettings: vi.fn(() => ({
      theme: 'dark',
      language: 'en',
      preferredRegion: 'US',
      layoutMode: 'grid',
      defaultHomeSection: 'trending',
      librarySortField: 'dateAdded',
      librarySortOrder: 'desc',
    })),
    saveSettings: vi.fn(),
    exportData: vi.fn(),
    importData: vi.fn(),
  }
})

// Import after mock is defined
import { useSettings } from '@/application/use-settings'

describe('useSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with values from storage', () => {
    const { theme, language } = useSettings()
    expect(theme.value).toBe('dark')
    expect(language.value).toBe('en')
  })

  it('should save settings to storage when values change', async () => {
    const { theme } = useSettings()
    theme.value = 'light'

    // Wait for watch to trigger
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(storageService.saveSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'light',
      }),
    )
  })

  it('should expose export and import methods', () => {
    const { triggerExport, importLibrary } = useSettings()
    expect(triggerExport).toBeDefined()
    expect(importLibrary).toBeDefined()
  })

  it('should call storageService.exportData when triggerExport is called', async () => {
    const { triggerExport } = useSettings()
    await triggerExport()
    expect(storageService.exportData).toHaveBeenCalled()
  })

  it('should call storageService.importData when importLibrary is called', async () => {
    const { importLibrary } = useSettings()
    const mockData = { some: 'data' }
    await importLibrary(mockData, 'merge')
    expect(storageService.importData).toHaveBeenCalledWith(mockData, 'merge')
  })
})
