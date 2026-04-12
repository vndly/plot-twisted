import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import CalendarScreen from '@/presentation/views/calendar-screen.vue'
import CalendarGrid from '@/presentation/components/calendar/calendar-grid.vue'

// Mock vue-router
const mockRoute = {
  query: { year: '2026', month: '3' },
}
const mockRouter = {
  push: vi.fn(),
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
}))

// Mock useUpcomingMovies
vi.mock('@/application/use-upcoming-movies', () => ({
  useUpcomingMovies: () => ({
    movies: ref([]),
    loading: ref(false),
    error: ref(null),
    retry: vi.fn(),
  }),
}))

// Mock useSettings
vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language: ref('en'),
    preferredRegion: ref('US'),
  }),
}))

type Locale = 'en' | 'fr'

function createTestI18n(locale: Locale) {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'calendar.nav.today': 'Today',
        'calendar.nav.previous': 'Previous Month',
        'calendar.nav.next': 'Next Month',
        'common.retry': 'Retry',
      },
      fr: {
        'calendar.nav.today': "Aujourd'hui",
        'calendar.nav.previous': 'Mois précédent',
        'calendar.nav.next': 'Mois suivant',
        'common.retry': 'Réessayer',
      },
    },
  })
}

function renderCalendarScreen(locale: Locale) {
  return mount(CalendarScreen, {
    global: {
      plugins: [createTestI18n(locale)],
      stubs: {
        'lucide-vue-next': true,
      },
    },
  })
}

describe('CalendarScreen', () => {
  it('renders the header with localized month and year in English', () => {
    // Arrange
    const wrapper = renderCalendarScreen('en')

    // Assert
    expect(wrapper.get('h1').text()).toContain('April')
    expect(wrapper.get('h1').text()).toContain('2026')
    expect(wrapper.findComponent(CalendarGrid).exists()).toBe(true)
  })

  it('renders the header with localized month and year in French', () => {
    // Arrange
    const wrapper = renderCalendarScreen('fr')

    // Assert
    expect(wrapper.get('h1').text()).toContain('avril')
    expect(wrapper.get('h1').text()).toContain('2026')
    expect(wrapper.findComponent(CalendarGrid).exists()).toBe(true)
  })
})
