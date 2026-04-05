import { mount } from '@vue/test-utils'
import { Bookmark } from 'lucide-vue-next'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import EmptyState from '@/presentation/components/common/empty-state.vue'
import LibraryScreen from '@/presentation/views/library-screen.vue'
import TabToggle from '@/presentation/components/common/tab-toggle.vue'

type Locale = 'en' | 'fr'

function createTestI18n(locale: Locale) {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'page.library.title': 'Library',
        'library.tabs.watchlist': 'Watchlist',
        'library.tabs.watched': 'Watched',
        'library.tabs.lists': 'Lists',
        'library.empty.watchlist.title': 'Your watchlist is empty',
        'library.empty.watchlist.description': 'Add movies and shows you want to watch later.',
      },
      fr: {
        'page.library.title': 'Bibliothèque',
        'library.tabs.watchlist': 'Liste de suivi',
        'library.tabs.watched': 'Vu',
        'library.tabs.lists': 'Listes',
        'library.empty.watchlist.title': 'Votre liste de suivi est vide',
        'library.empty.watchlist.description':
          'Ajoutez des films et des séries que vous souhaitez voir plus tard.',
      },
    },
  })
}

function renderLibraryScreen(locale: Locale) {
  return mount(LibraryScreen, {
    global: {
      plugins: [createTestI18n(locale)],
      stubs: {
        // Stub components that might need router or other complex setup
        EntryGrid: true,
      },
    },
  })
}

describe('LibraryScreen', () => {
  it('renders the library title and tabs', () => {
    // Arrange
    const wrapper = renderLibraryScreen('en')

    // Assert
    expect(wrapper.get('h1').text()).toBe('Library')
    expect(wrapper.findComponent(TabToggle).exists()).toBe(true)
  })

  it('renders the empty watchlist state by default in English', () => {
    // Arrange
    const wrapper = renderLibraryScreen('en')

    // Assert
    expect(wrapper.findComponent(EmptyState).exists()).toBe(true)
    expect(wrapper.findComponent(Bookmark).exists()).toBe(true)
    expect(wrapper.get('h2').text()).toBe('Your watchlist is empty')
    expect(wrapper.get('[data-testid="empty-state-description"]').text()).toBe(
      'Add movies and shows you want to watch later.',
    )
  })

  it('renders the empty watchlist state by default in French', () => {
    // Arrange
    const wrapper = renderLibraryScreen('fr')

    // Assert
    expect(wrapper.findComponent(EmptyState).exists()).toBe(true)
    expect(wrapper.findComponent(Bookmark).exists()).toBe(true)
    expect(wrapper.get('h2').text()).toBe('Votre liste de suivi est vide')
    expect(wrapper.get('[data-testid="empty-state-description"]').text()).toBe(
      'Ajoutez des films et des séries que vous souhaitez voir plus tard.',
    )
  })
})
