import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi } from 'vitest'
import SettingsScreen from '@/presentation/views/settings-screen.vue'
import ThemeToggle from '@/presentation/components/settings/ThemeToggle.vue'
import LayoutModeToggle from '@/presentation/components/settings/LayoutModeToggle.vue'
import SettingsSelect from '@/presentation/components/settings/SettingsSelect.vue'

vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language: { value: 'en' },
    preferredRegion: { value: 'US' },
    layoutMode: { value: 'grid' },
    theme: { value: 'dark' },
    defaultHomeSection: { value: 'trending' },
    exportLibrary: vi.fn(),
    importLibrary: vi.fn(),
  }),
}))

vi.mock('@/presentation/composables/use-modal', () => ({
  useModal: () => ({
    open: vi.fn(),
    close: vi.fn(),
    isOpen: { value: false },
    props: { value: null },
  }),
}))

function createTestI18n() {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'settings.title': 'Settings',
        'settings.description': 'Customize your experience',
        'settings.sections.appearance': 'Appearance',
        'settings.sections.content': 'Content',
        'settings.sections.navigation': 'Navigation',
        'settings.sections.data': 'Data',
        'settings.appearance.theme.label': 'Theme',
        'settings.appearance.layout.label': 'Layout',
        'settings.content.language.label': 'Language',
        'settings.content.region.label': 'Region',
        'settings.navigation.home.label': 'Home',
        'settings.data.export': 'Export',
        'settings.data.import': 'Import',
        'home.sections.trending': 'Trending',
        'home.sections.popular': 'Popular',
        'home.sections.search': 'Search',
      },
    },
  })
}

describe('SettingsScreen', () => {
  it('renders all settings sections', () => {
    const wrapper = mount(SettingsScreen, {
      global: {
        plugins: [createTestI18n()],
      },
    })

    expect(wrapper.get('h1').text()).toBe('Settings')
    expect(wrapper.findAll('h2')).toHaveLength(4) // Appearance, Content, Navigation, Data
  })

  it('renders specialized toggle and select components', () => {
    const wrapper = mount(SettingsScreen, {
      global: {
        plugins: [createTestI18n()],
      },
    })

    expect(wrapper.findComponent(ThemeToggle).exists()).toBe(true)
    expect(wrapper.findComponent(LayoutModeToggle).exists()).toBe(true)
    expect(wrapper.findAllComponents(SettingsSelect)).toHaveLength(3) // Language, Region, Home Section
  })

  it('renders data management buttons', () => {
    const wrapper = mount(SettingsScreen, {
      global: {
        plugins: [createTestI18n()],
      },
    })

    const buttons = wrapper.findAll('button')
    const exportBtn = buttons.find((b) => b.text().includes('Export'))
    const importBtn = buttons.find((b) => b.text().includes('Import'))

    expect(exportBtn?.exists()).toBe(true)
    expect(importBtn?.exists()).toBe(true)
  })
})
