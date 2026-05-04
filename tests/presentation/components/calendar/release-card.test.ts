import { mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import ReleaseCard from '@/presentation/components/calendar/release-card.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
  }),
}))

describe('ReleaseCard', () => {
  beforeEach(() => {
    push.mockReset()
  })

  const movie = {
    id: 7,
    title: 'Arrival',
    release_date: '2026-04-18',
    poster_path: '/arrival.jpg',
    backdrop_path: '/arrival-backdrop.jpg',
    vote_average: 8,
    vote_count: 100,
    popularity: 10,
    genre_ids: [18],
    adult: false,
    original_language: 'en',
    video: false,
    original_title: 'Arrival',
    overview: 'Overview',
  }

  it('renders the movie title and poster image when available', () => {
    const wrapper = mount(ReleaseCard, {
      props: {
        movie,
      },
    })

    expect(wrapper.text()).toContain('Arrival')
    expect(wrapper.get('img').attributes('alt')).toBe('Arrival')
    expect(wrapper.get('img').attributes('src')).toContain('/arrival.jpg')
  })

  it('renders without an image when the movie has no poster path', () => {
    const wrapper = mount(ReleaseCard, {
      props: {
        movie: {
          ...movie,
          poster_path: null,
        },
      },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Arrival')
  })

  it('navigates to the movie detail route on click', async () => {
    const wrapper = mount(ReleaseCard, {
      props: {
        movie,
      },
    })

    await wrapper.get('[role="button"]').trigger('click')

    expect(push).toHaveBeenCalledWith('/movie/7')
  })

  it('opens detail in new tab on middle mouse click', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    const wrapper = mount(ReleaseCard, {
      props: {
        movie,
      },
    })

    await wrapper.get('[role="button"]').trigger('auxclick', { button: 1 })

    expect(openSpy).toHaveBeenCalledWith('/movie/7', '_blank')
    openSpy.mockRestore()
  })

  it('ignores non-middle mouse button auxclick events', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    const wrapper = mount(ReleaseCard, {
      props: {
        movie,
      },
    })

    await wrapper.get('[role="button"]').trigger('auxclick', { button: 0 })
    await wrapper.get('[role="button"]').trigger('auxclick', { button: 2 })

    expect(openSpy).not.toHaveBeenCalled()
    openSpy.mockRestore()
  })
})
