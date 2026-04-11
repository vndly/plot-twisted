import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createRouter, createMemoryHistory } from 'vue-router'
import FilterBar from '@/presentation/components/home/filter-bar.vue'
import { ref, computed } from 'vue'

// Mock useFilters
const mockFilters = ref({
  genres: [] as number[],
  mediaType: 'all',
  yearFrom: null as number | null,
  yearTo: null as number | null,
})
const mockClearAll = vi.fn()

vi.mock('@/application/use-filters', () => ({
  useFilters: () => ({
    filters: mockFilters,
    genres: ref([
      { id: 28, name: 'Action' },
      { id: 35, name: 'Comedy' },
    ]),
    clearAll: mockClearAll,
    activeFilterCount: computed(() => {
      let count = 0
      if (mockFilters.value.genres.length > 0) count++
      if (mockFilters.value.mediaType !== 'all') count++
      if (mockFilters.value.yearFrom !== null) count++
      if (mockFilters.value.yearTo !== null) count++
      return count
    }),
  }),
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      'home.filters.genre': 'Genre',
      'home.filters.mediaType.all': 'All',
      'home.filters.mediaType.movie': 'Movies',
      'home.filters.mediaType.tv': 'TV Shows',
      'home.filters.yearFrom': 'From Year',
      'home.filters.yearTo': 'To Year',
      'home.filters.clear': 'Clear All',
    },
  },
})

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div></div>' } }],
})

describe('FilterBar', () => {
  beforeEach(() => {
    mockFilters.value.genres = []
    mockFilters.value.mediaType = 'all'
    mockFilters.value.yearFrom = null
    mockFilters.value.yearTo = null
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    expect(wrapper.text()).toContain('Genre')
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('Movies')
  })

  it('toggles genre dropdown', async () => {
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.text()).toContain('Action')
    expect(wrapper.text()).toContain('Comedy')
  })

  it('updates media type when clicked', async () => {
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    const movieButton = wrapper.findAll('button').find((b) => b.text() === 'Movies')
    await movieButton?.trigger('click')
    expect(mockFilters.value.mediaType).toBe('movie')
  })

  it('shows clear button when filters are active', async () => {
    mockFilters.value.mediaType = 'movie'
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    expect(wrapper.text()).toContain('Clear All')
  })

  it('calls clearAll when clear button clicked', async () => {
    mockFilters.value.mediaType = 'movie'
    const wrapper = mount(FilterBar, {
      global: { plugins: [i18n, router] },
    })
    const clearButton = wrapper.findAll('button').find((b) => b.text() === 'Clear All')
    await clearButton?.trigger('click')
    expect(mockClearAll).toHaveBeenCalled()
  })
})
