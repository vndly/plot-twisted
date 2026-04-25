import { describe, it, expect, beforeEach } from 'vitest'
import {
  clearAllData,
  getSettings,
  saveSettings,
  STORAGE_KEY,
  STORAGE_KEY_SETTINGS,
} from '@/infrastructure/storage.service'
import { DEFAULT_SETTINGS } from '@/domain/settings.schema'

describe('storage.service settings', () => {
  const originalLanguage = navigator.language
  const originalLanguages = navigator.languages

  beforeEach(() => {
    localStorage.clear()
    setNavigatorLocales(originalLanguage, [...originalLanguages])
  })

  function setNavigatorLocales(language: string, languages: readonly string[] = [language]) {
    Object.defineProperty(navigator, 'language', {
      configurable: true,
      value: language,
    })
    Object.defineProperty(navigator, 'languages', {
      configurable: true,
      value: languages,
    })
  }

  it('returns default settings when none exist', () => {
    const settings = getSettings()
    expect(settings).toEqual(DEFAULT_SETTINGS)
  })

  it('saves and retrieves settings', () => {
    const newSettings = {
      ...DEFAULT_SETTINGS,
      theme: 'light' as const,
      language: 'fr',
    }
    saveSettings(newSettings)

    const retrieved = getSettings()
    expect(retrieved).toEqual(newSettings)
  })

  it('migrates layoutMode from standalone key', () => {
    localStorage.setItem('layoutMode', 'list')

    const settings = getSettings()
    expect(settings.layoutMode).toBe('list')
    expect(localStorage.getItem('layoutMode')).toBeNull()
  })

  it('removes legacy list storage data', () => {
    localStorage.setItem('plot-twisted-lists', JSON.stringify([{ name: 'Old list' }]))

    getSettings()

    expect(localStorage.getItem('plot-twisted-lists')).toBeNull()
  })

  it('merges existing settings with defaults when some fields are missing', () => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({ theme: 'light' }))

    const settings = getSettings()
    expect(settings.theme).toBe('light')
    expect(settings.language).toBe(DEFAULT_SETTINGS.language)
    expect(settings.librarySortField).toBe(DEFAULT_SETTINGS.librarySortField)
  })

  it('uses the browser locale region for default settings', () => {
    setNavigatorLocales('de-CH')

    const settings = getSettings()

    expect(settings.preferredRegion).toBe('CH')
  })

  it('overrides stored preferred region with the browser locale region', () => {
    setNavigatorLocales('fr-FR')
    localStorage.setItem(
      STORAGE_KEY_SETTINGS,
      JSON.stringify({ ...DEFAULT_SETTINGS, preferredRegion: 'US' }),
    )

    const settings = getSettings()
    const storedSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS) || '{}')

    expect(settings.preferredRegion).toBe('FR')
    expect(storedSettings.preferredRegion).toBe('FR')
  })

  it('falls back to defaults for invalid settings', () => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, 'invalid json')
    const settings = getSettings()
    expect(settings).toEqual(DEFAULT_SETTINGS)
  })

  it('falls back to defaults when merged settings still fail schema validation', () => {
    localStorage.setItem(
      STORAGE_KEY_SETTINGS,
      JSON.stringify({
        theme: 'light',
        layoutMode: 'masonry',
      }),
    )

    const settings = getSettings()
    expect(settings).toEqual(DEFAULT_SETTINGS)
  })

  it('clears all local app data', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 1 }]))
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS))
    localStorage.setItem('plot-twisted-lists', JSON.stringify([{ name: 'Old list' }]))
    localStorage.setItem('layoutMode', 'list')

    clearAllData()

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY_SETTINGS)).toBeNull()
    expect(localStorage.getItem('plot-twisted-lists')).toBeNull()
    expect(localStorage.getItem('layoutMode')).toBeNull()
  })

  it('falls back to regex region extraction when Intl.Locale throws', () => {
    // Use a locale format that causes Intl.Locale to throw but has region in the string
    const originalLocale = Intl.Locale
    const throwingLocale = function (this: Intl.Locale, locale: string) {
      if (locale === 'invalid-DE') {
        throw new Error('Invalid locale')
      }
      return new originalLocale(locale)
    } as unknown as typeof Intl.Locale
    throwingLocale.prototype = originalLocale.prototype

    vi.stubGlobal('Intl', {
      ...Intl,
      Locale: throwingLocale,
    })

    setNavigatorLocales('invalid-DE', ['invalid-DE'])

    const settings = getSettings()

    expect(settings.preferredRegion).toBe('DE')

    vi.unstubAllGlobals()
  })

  it('falls back to default region when no locale contains a valid region', () => {
    // Use a language-only locale with no region part
    setNavigatorLocales('en', ['en', 'fr'])

    const settings = getSettings()

    expect(settings.preferredRegion).toBe(DEFAULT_SETTINGS.preferredRegion)
  })
})
