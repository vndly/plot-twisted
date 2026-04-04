import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createRouter, createMemoryHistory } from 'vue-router'
import SearchResults from '@/presentation/components/home/search-results.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      'home.search.empty.title': 'No results found',
      'home.search.empty.subtitle': 'Try different keywords or check your spelling',
      'home.search.error.message': 'Failed to load search results',
      'home.search.error.retry': 'Retry',
    },
  },
})

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/movie/:id', name: 'movie', component: { template: '<div>Movie</div>' } },
    { path: '/show/:id', name: 'show', component: { template: '<div>Show</div>' } },
  ],
})

const mockMovieResult = {
  id: 550,
  title: 'Fight Club',
  original_title: 'Fight Club',
  overview: 'A movie.',
  release_date: '1999-10-15',
  poster_path: '/path.jpg',
  backdrop_path: '/backdrop.jpg',
  vote_average: 8.4,
  vote_count: 27000,
  popularity: 73.4,
  genre_ids: [18],
  adult: false,
  original_language: 'en',
  video: false,
  media_type: 'movie' as const,
}

const mockTvResult = {
  id: 1396,
  name: 'Breaking Bad',
  original_name: 'Breaking Bad',
  overview: 'A show.',
  first_air_date: '2008-01-20',
  poster_path: '/path2.jpg',
  backdrop_path: '/backdrop2.jpg',
  vote_average: 8.9,
  vote_count: 12000,
  popularity: 400.5,
  genre_ids: [18],
  adult: false,
  original_language: 'en',
  origin_country: ['US'],
  media_type: 'tv' as const,
}

describe('SearchResults', () => {
  const mountComponent = (props = {}) => {
    return mount(SearchResults, {
      props: {
        results: [],
        loading: false,
        error: null,
        query: '',
        ...props,
      },
      global: {
        plugins: [i18n, router],
        stubs: {
          MovieCard: {
            template: '<div data-testid="movie-card" @click="$emit(\'click\')"><slot /></div>',
            props: ['item'],
          },
          MovieCardSkeleton: {
            template: '<div data-testid="skeleton" />',
          },
        },
      },
    })
  }

  describe('loading state', () => {
    it('renders skeleton grid when loading (HS-07-01)', () => {
      // Arrange
      const wrapper = mountComponent({ loading: true, query: 'test' })

      // Assert
      const skeletons = wrapper.findAll('[data-testid="skeleton"]')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('displays exactly 8 skeleton placeholders (HS-07-09)', () => {
      // Arrange
      const wrapper = mountComponent({ loading: true, query: 'test' })

      // Assert
      const skeletons = wrapper.findAll('[data-testid="skeleton"]')
      expect(skeletons).toHaveLength(8)
    })

    it('skeleton grid has responsive columns (HS-07-02, HS-07-07)', () => {
      // Arrange
      const wrapper = mountComponent({ loading: true, query: 'test' })

      // Assert
      const grid = wrapper.find('[data-testid="results-grid"]')
      expect(grid.exists()).toBe(true)
      // Check for responsive grid classes
      expect(grid.classes()).toContain('grid')
    })
  })

  describe('error state', () => {
    it('renders error message with retry button (HS-08-01, HS-08-02)', () => {
      // Arrange
      const wrapper = mountComponent({
        error: new Error('Network error'),
        query: 'test',
      })

      // Assert
      expect(wrapper.text()).toContain('Failed to load search results')
      expect(wrapper.find('[data-testid="retry-button"]').exists()).toBe(true)
    })

    it('error is inline, not full-page (HS-08-05)', () => {
      // Arrange
      const wrapper = mountComponent({
        error: new Error('Network error'),
        query: 'test',
      })

      // Assert - error should not have fixed positioning or full viewport classes
      const errorContainer = wrapper.find('[data-testid="error-container"]')
      expect(errorContainer.exists()).toBe(true)
      expect(errorContainer.classes()).not.toContain('fixed')
      expect(errorContainer.classes()).not.toContain('inset-0')
    })

    it('emits retry event when retry button is clicked', async () => {
      // Arrange
      const wrapper = mountComponent({
        error: new Error('Network error'),
        query: 'test',
      })

      // Act
      await wrapper.find('[data-testid="retry-button"]').trigger('click')

      // Assert
      expect(wrapper.emitted('retry')).toBeTruthy()
    })
  })

  describe('empty state', () => {
    it('renders empty state when results empty and query non-empty (HS-06-01)', () => {
      // Arrange
      const wrapper = mountComponent({
        results: [],
        query: 'xyznonexistent',
      })

      // Assert
      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
    })

    it('shows heading and subtitle (HS-06-02)', () => {
      // Arrange
      const wrapper = mountComponent({
        results: [],
        query: 'xyznonexistent',
      })

      // Assert
      expect(wrapper.text()).toContain('No results found')
      expect(wrapper.text()).toContain('Try different keywords or check your spelling')
    })

    it('empty state is centered (HS-06-03)', () => {
      // Arrange
      const wrapper = mountComponent({
        results: [],
        query: 'xyznonexistent',
      })

      // Assert
      const emptyState = wrapper.find('[data-testid="empty-state"]')
      expect(emptyState.classes()).toContain('flex')
      expect(emptyState.classes()).toContain('items-center')
      expect(emptyState.classes()).toContain('justify-center')
    })

    it('does not show empty state when query is empty (HS-06-04)', () => {
      // Arrange
      const wrapper = mountComponent({
        results: [],
        query: '',
      })

      // Assert
      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false)
    })

    it('does not show empty state when loading', () => {
      // Arrange
      const wrapper = mountComponent({
        results: [],
        query: 'test',
        loading: true,
      })

      // Assert
      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false)
    })
  })

  describe('results display', () => {
    it('renders MovieCard grid when results present (HS-04-01)', () => {
      // Arrange
      const wrapper = mountComponent({
        results: [mockMovieResult, mockTvResult],
        query: 'test',
      })

      // Assert
      const cards = wrapper.findAll('[data-testid="movie-card"]')
      expect(cards).toHaveLength(2)
    })

    it('grid has responsive columns (HS-04-07, HS-04-08)', () => {
      // Arrange
      const wrapper = mountComponent({
        results: [mockMovieResult],
        query: 'test',
      })

      // Assert
      const grid = wrapper.find('[data-testid="results-grid"]')
      expect(grid.exists()).toBe(true)
      expect(grid.classes()).toContain('grid-cols-2')
    })

    it('navigates to movie detail on card click (HS-05-01)', async () => {
      // Arrange
      const pushSpy = vi.spyOn(router, 'push')
      const wrapper = mountComponent({
        results: [mockMovieResult],
        query: 'test',
      })

      // Act
      await wrapper.find('[data-testid="movie-card"]').trigger('click')

      // Assert
      expect(pushSpy).toHaveBeenCalledWith('/movie/550')
    })

    it('navigates to show detail on TV card click (HS-05-02)', async () => {
      // Arrange
      const pushSpy = vi.spyOn(router, 'push')
      const wrapper = mountComponent({
        results: [mockTvResult],
        query: 'test',
      })

      // Act
      await wrapper.find('[data-testid="movie-card"]').trigger('click')

      // Assert
      expect(pushSpy).toHaveBeenCalledWith('/show/1396')
    })
  })
})
