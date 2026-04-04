import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { Compass } from 'lucide-vue-next'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import EmptyState from '@/presentation/components/common/empty-state.vue'
import RecommendationsScreen from '@/presentation/views/recommendations-screen.vue'

type Locale = 'en' | 'fr'

function createTestI18n(locale: Locale) {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'common.empty.title': 'Nothing here yet',
        'common.empty.description': 'This page is under construction.',
      },
      fr: {
        'common.empty.title': 'Rien ici pour le moment',
        'common.empty.description': 'Cette page est en construction.',
      },
    },
  })
}

function renderRecommendationsScreen(locale: Locale) {
  return mount(RecommendationsScreen, {
    global: {
      plugins: [createTestI18n(locale)],
    },
  })
}

describe('RecommendationsScreen', () => {
  // R-01b-06-01
  it('renders the documented placeholder content in English', () => {
    // Arrange
    const wrapper = renderRecommendationsScreen('en')

    // Assert
    expect(wrapper.findComponent(EmptyState).exists()).toBe(true)
    expect(wrapper.findComponent(Compass).exists()).toBe(true)
    expect(wrapper.get('h2').text()).toBe('Nothing here yet')
    expect(wrapper.get('[data-testid="empty-state-description"]').text()).toBe(
      'This page is under construction.',
    )
  })

  // R-01b-06-01
  it('renders the documented placeholder content in French', () => {
    // Arrange
    const wrapper = renderRecommendationsScreen('fr')

    // Assert
    expect(wrapper.findComponent(EmptyState).exists()).toBe(true)
    expect(wrapper.findComponent(Compass).exists()).toBe(true)
    expect(wrapper.get('h2').text()).toBe('Rien ici pour le moment')
    expect(wrapper.get('[data-testid="empty-state-description"]').text()).toBe(
      'Cette page est en construction.',
    )
  })

  // R-01b-06-02
  it('uses shared translation bindings and contains no hardcoded placeholder copy', () => {
    // Arrange
    const sourceFile = readFileSync(
      resolve(process.cwd(), 'src/presentation/views/recommendations-screen.vue'),
      'utf8',
    )

    // Assert
    expect(sourceFile).toContain('common.empty.title')
    expect(sourceFile).toContain('common.empty.description')
    expect(sourceFile).not.toContain('Nothing here yet')
    expect(sourceFile).not.toContain('This page is under construction')
  })
})
