/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TrendingCarousel from '@/presentation/components/home/trending-carousel.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
  }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

describe('TrendingCarousel', () => {
  beforeEach(() => {
    push.mockReset()
  })

  const mockItems = [
    {
      id: 1,
      media_type: 'movie' as const,
      title: 'Movie Title',
      backdrop_path: null,
      poster_path: '/poster.jpg',
      vote_average: 8.0,
      release_date: '2024',
      original_title: 'Movie Title',
      overview: 'Overview',
      genre_ids: [1],
      adult: false,
      original_language: 'en',
      video: false,
      popularity: 100,
      vote_count: 100,
    },
    {
      id: 2,
      media_type: 'tv' as const,
      name: 'Show Name',
      backdrop_path: '/backdrop2.jpg',
      poster_path: '/poster2.jpg',
      vote_average: 7.0,
      first_air_date: 'not-a-date',
      original_name: 'Show Name',
      overview: 'Overview',
      genre_ids: [2],
      adult: false,
      original_language: 'en',
      origin_country: ['US'],
      popularity: 100,
      vote_count: 100,
    },
  ]

  it('renders loading state', () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: [], loading: true },
    })
    // 6 skeleton cards, each with 3 animated elements (poster, title, subtitle)
    expect(wrapper.findAll('.animate-pulse')).toHaveLength(18)
  })

  it('renders items when not loading', () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
    })

    expect(wrapper.text()).toContain('Movie Title')
    expect(wrapper.text()).toContain('Show Name')
    expect(wrapper.findAll('img')).toHaveLength(2)
    // Now uses poster images with w342 (medium) size
    expect(wrapper.findAll('img')[0].attributes('src')).toContain('/poster.jpg')
    expect(wrapper.findAll('img')[0].attributes('src')).toContain('/w342/poster.jpg')
    expect(wrapper.findAll('img')[0].attributes('srcset')).toContain('/w342/poster.jpg 342w')
    expect(wrapper.findAll('img')[1].attributes('src')).toContain('/w342/poster2.jpg')
    expect(wrapper.text()).not.toContain('not-a-date')
  })

  it('navigates to detail pages on click and keyboard activation', async () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
    })

    const cards = wrapper.findAll('[role="button"]')
    await cards[0].trigger('click')
    await cards[1].trigger('keydown.enter')
    await cards[0].trigger('keydown.space')

    expect(push).toHaveBeenNthCalledWith(1, '/movie/1')
    expect(push).toHaveBeenNthCalledWith(2, '/show/2')
    expect(push).toHaveBeenNthCalledWith(3, '/movie/1')
  })

  it('omits the year when the item has no release date', () => {
    const wrapper = mount(TrendingCarousel, {
      props: {
        items: [
          {
            ...mockItems[0],
            id: 3,
            release_date: '',
          },
        ],
        loading: false,
      },
    })

    expect(wrapper.text()).not.toContain('·')
  })

  it('falls back to a text placeholder when no artwork is available', () => {
    const wrapper = mount(TrendingCarousel, {
      props: {
        items: [
          {
            ...mockItems[0],
            id: 4,
            backdrop_path: null,
            poster_path: null,
          },
        ],
        loading: false,
      },
    })

    // No img element when poster is missing; shows text placeholder instead
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Movie Title')
  })

  it('renders scroll controls and scrolls the carousel when clicked', async () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
    })

    const scrollContainer = wrapper.get('[data-testid="trending-carousel"]').element as HTMLElement
    const scrollBy = vi.fn()
    scrollContainer.scrollBy = scrollBy
    Object.defineProperty(scrollContainer, 'clientWidth', {
      configurable: true,
      value: 600,
    })
    // Mock scrollWidth > clientWidth to trigger canScroll = true
    Object.defineProperty(scrollContainer, 'scrollWidth', {
      configurable: true,
      value: 1200,
    })
    // Trigger the updateCanScroll function by calling the resize observer callback
    ;(wrapper.vm as any).updateCanScroll()
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[data-testid="trending-carousel"]').classes()).toContain(
      '[scrollbar-width:none]',
    )

    await wrapper.get('[data-testid="trending-scroll-next"]').trigger('click')
    await wrapper.get('[data-testid="trending-scroll-previous"]').trigger('click')

    expect(scrollBy).toHaveBeenNthCalledWith(1, {
      left: 510,
      behavior: 'smooth',
    })
    expect(scrollBy).toHaveBeenNthCalledWith(2, {
      left: -510,
      behavior: 'smooth',
    })
  })

  it('does nothing when the scroll controls are triggered without a carousel ref', async () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
    })

    ;(wrapper.vm as any).carouselRef = null
    ;(wrapper.vm as any).scrollCarousel('next')

    expect(push).not.toHaveBeenCalled()
  })

  it('hides scroll controls when content does not overflow', () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: [mockItems[0]], loading: false },
    })

    // In jsdom, scrollWidth === clientWidth by default, so canScroll stays false
    expect(wrapper.find('[data-testid="trending-scroll-next"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="trending-scroll-previous"]').exists()).toBe(false)
  })

  it('opens detail in new tab on middle mouse click', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
    })

    const cards = wrapper.findAll('[role="button"]')
    await cards[0].trigger('auxclick', { button: 1 })
    await cards[1].trigger('auxclick', { button: 1 })

    expect(openSpy).toHaveBeenNthCalledWith(1, '/movie/1', '_blank')
    expect(openSpy).toHaveBeenNthCalledWith(2, '/show/2', '_blank')

    openSpy.mockRestore()
  })

  it('ignores non-middle mouse button auxclick events', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
    })

    const card = wrapper.find('[role="button"]')
    await card.trigger('auxclick', { button: 0 })
    await card.trigger('auxclick', { button: 2 })

    expect(openSpy).not.toHaveBeenCalled()
    openSpy.mockRestore()
  })

  it('handles ref changes between loading and loaded states', async () => {
    // Start in loading state (carouselRef not rendered)
    const wrapper = mount(TrendingCarousel, {
      props: { items: [], loading: true },
    })

    // No carousel should exist
    expect(wrapper.find('[data-testid="trending-carousel"]').exists()).toBe(false)

    // Switch to loaded state (carouselRef now exists)
    await wrapper.setProps({ items: mockItems, loading: false })

    // Carousel should now exist
    expect(wrapper.find('[data-testid="trending-carousel"]').exists()).toBe(true)

    // Switch back to loading (carouselRef removed)
    await wrapper.setProps({ items: [], loading: true })

    // Carousel should be gone again
    expect(wrapper.find('[data-testid="trending-carousel"]').exists()).toBe(false)
  })

  it('resets scroll position and updates canScroll when items change', async () => {
    const wrapper = mount(TrendingCarousel, {
      props: { items: mockItems, loading: false },
    })

    // Track calls to the scrollLeft setter
    const scrollLeftSetterSpy = vi.fn()
    const scrollContainer = wrapper.get('[data-testid="trending-carousel"]').element as HTMLElement
    Object.defineProperty(scrollContainer, 'scrollLeft', {
      configurable: true,
      get: () => 100,
      set: scrollLeftSetterSpy,
    })

    // Update items
    await wrapper.setProps({
      items: [
        {
          ...mockItems[0],
          id: 10,
          title: 'New Movie',
        },
      ],
    })

    // Wait for the watcher and nextTick to process
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    // The watch should have set scrollLeft to 0
    expect(scrollLeftSetterSpy).toHaveBeenCalledWith(0)
  })
})
