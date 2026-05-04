import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import FilmographyGrid from '@/presentation/components/details/filmography-grid.vue'
import type { PersonCreditViewModel } from '@/application/use-person'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  flatJson: true,
  messages: {
    en: {
      'person.filmographyCount': '{count} Credits',
      'person.creditsEmpty': 'No credits found',
    },
  },
})

describe('FilmographyGrid', () => {
  const mockCredits: PersonCreditViewModel[] = [
    {
      id: 1,
      mediaType: 'movie',
      title: 'Fight Club',
      character: 'Narrator',
      releaseYear: '1999',
      posterUrl: '/poster.jpg',
      voteAverage: 8.4,
      route: '/movie/1',
    },
    {
      id: 2,
      mediaType: 'tv',
      title: 'Breaking Bad',
      character: 'Jesse',
      releaseYear: '2008',
      posterUrl: null,
      voteAverage: 9.5,
      route: '/show/2',
    },
  ]

  it('renders section with filmography count title', () => {
    const wrapper = mount(FilmographyGrid, {
      props: { credits: mockCredits },
      global: {
        plugins: [i18n],
        stubs: {
          FilmographyCard: {
            props: ['credit'],
            template: '<div data-testid="filmography-card">{{ credit.title }}</div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="filmography-section"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('2 Credits')
  })

  it('renders FilmographyCard for each credit', () => {
    const wrapper = mount(FilmographyGrid, {
      props: { credits: mockCredits },
      global: {
        plugins: [i18n],
        stubs: {
          FilmographyCard: {
            props: ['credit'],
            template: '<div data-testid="filmography-card">{{ credit.title }}</div>',
          },
        },
      },
    })

    const cards = wrapper.findAll('[data-testid="filmography-card"]')
    expect(cards).toHaveLength(2)
    expect(cards[0].text()).toContain('Fight Club')
    expect(cards[1].text()).toContain('Breaking Bad')
  })

  it('renders responsive grid layout for credits', () => {
    const wrapper = mount(FilmographyGrid, {
      props: { credits: mockCredits },
      global: {
        plugins: [i18n],
        stubs: {
          FilmographyCard: {
            props: ['credit'],
            template: '<div data-testid="filmography-card"></div>',
          },
        },
      },
    })

    const grid = wrapper.find('[data-testid="filmography-grid"]')
    expect(grid.exists()).toBe(true)
    expect(grid.classes()).toContain('grid')
    expect(grid.classes()).toContain('grid-cols-2')
  })

  it('renders empty state message when no credits', () => {
    const wrapper = mount(FilmographyGrid, {
      props: { credits: [] },
      global: {
        plugins: [i18n],
        stubs: {
          FilmographyCard: {
            props: ['credit'],
            template: '<div data-testid="filmography-card"></div>',
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="filmography-grid"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('No credits found')
  })
})
