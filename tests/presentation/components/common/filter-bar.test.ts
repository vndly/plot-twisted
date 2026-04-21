import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import FilterBar from '@/presentation/components/common/filter-bar.vue'

type FilterModel = {
  genres: number[]
  mediaType: 'all' | 'movie' | 'tv'
  yearFrom: number | null
  yearTo: number | null
  ratingMin: number
  ratingMax: number
}

const addEventListener = vi.spyOn(document, 'addEventListener')
const removeEventListener = vi.spyOn(document, 'removeEventListener')

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  flatJson: true,
  messages: {
    en: {
      'home.filters.genre': 'Genre',
      'home.filters.genreClear': 'Clear',
      'home.filters.genreSearch': 'Search genres',
      'home.filters.mediaType.all': 'All',
      'home.filters.mediaType.movie': 'Movies',
      'home.filters.mediaType.tv': 'Shows',
      'home.filters.yearFrom': 'From',
      'home.filters.yearTo': 'To',
      'home.filters.year.increment': 'Increment {label}',
      'home.filters.year.decrement': 'Decrement {label}',
      'home.filters.clear': 'Clear filters',
      'library.filters.rating': 'Rating',
      'library.filters.ratingMin': 'Minimum rating',
      'library.filters.ratingMax': 'Maximum rating',
    },
  },
})

describe('FilterBar', () => {
  beforeEach(() => {
    addEventListener.mockClear()
    removeEventListener.mockClear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 3, 18, 12))
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  function createModelValue(overrides: Partial<FilterModel> = {}): FilterModel {
    return {
      genres: [],
      mediaType: 'all',
      yearFrom: null,
      yearTo: null,
      ratingMin: 0,
      ratingMax: 5,
      ...overrides,
    }
  }

  function renderFilterBar(
    overrides: Partial<{
      genres: { id: number; name: string }[]
      modelValue: FilterModel
      activeFilterCount: number
      showGenre: boolean
      showMediaType: boolean
      showYearRange: boolean
      showRatingRange: boolean
      compactClear: boolean
    }> = {},
  ) {
    return mount(FilterBar, {
      props: {
        genres: [
          { id: 1, name: 'Action' },
          { id: 2, name: 'Comedy' },
        ],
        modelValue: createModelValue(),
        activeFilterCount: 0,
        ...overrides,
      },
      global: {
        plugins: [i18n],
      },
      attachTo: document.body,
    })
  }

  it('opens the genre dropdown, filters options, toggles genres, and resets search on close', async () => {
    const wrapper = renderFilterBar({
      showGenre: true,
      modelValue: createModelValue({ genres: [1] }),
      activeFilterCount: 1,
    })

    expect(addEventListener).toHaveBeenCalledWith('click', expect.any(Function))

    await wrapper.get('button').trigger('click')
    await wrapper.vm.$nextTick()

    const input = wrapper.get('[data-testid="genre-filter-input"]')
    await input.setValue('com')
    expect(wrapper.findAll('[data-testid="genre-option"]')).toHaveLength(1)

    await wrapper.get('[data-testid="genre-option"]').trigger('click')
    expect((wrapper.emitted('update:modelValue')?.[0][0] as FilterModel).genres).toEqual([1, 2])

    await wrapper.setProps({
      modelValue: createModelValue({ genres: [1] }),
    })
    await input.setValue('act')
    await wrapper.get('[data-testid="genre-option"]').trigger('click')
    expect((wrapper.emitted('update:modelValue')?.[1][0] as FilterModel).genres).toEqual([])

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="genre-filter-input"]').exists()).toBe(false)

    await wrapper.get('button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(
      (wrapper.get('[data-testid="genre-filter-input"]').element as HTMLInputElement).value,
    ).toBe('')

    const setupState = (wrapper.vm as unknown as { $?: { setupState?: { isGenreOpen: boolean } } })
      .$?.setupState
    if (!setupState) {
      throw new Error('Expected setup state to be available')
    }
    setupState.isGenreOpen = false
    await wrapper.vm.$nextTick()

    wrapper.unmount()
    expect(removeEventListener).toHaveBeenCalledWith('click', expect.any(Function))
  })

  it('shows a genre clear button only when genres are selected and clears only genres', async () => {
    const wrapper = renderFilterBar({
      showGenre: true,
      showMediaType: true,
    })

    await wrapper.get('button').trigger('click')
    expect(wrapper.find('[data-testid="genre-clear-button"]').exists()).toBe(false)

    await wrapper.setProps({
      modelValue: createModelValue({
        genres: [1, 2],
        mediaType: 'movie',
        yearFrom: 1999,
        yearTo: 2024,
        ratingMin: 2,
        ratingMax: 4,
      }),
    })
    await wrapper.get('[data-testid="genre-clear-button"]').trigger('click')

    const payload = wrapper.emitted('update:modelValue')?.[0][0] as FilterModel
    expect(payload).toMatchObject({
      genres: [],
      mediaType: 'movie',
      yearFrom: 1999,
      yearTo: 2024,
      ratingMin: 2,
      ratingMax: 4,
    })
  })

  it('emits normalized year changes for buttons and typed input', async () => {
    const wrapper = renderFilterBar({
      showYearRange: true,
      modelValue: createModelValue({
        yearFrom: 1900,
        yearTo: 2031,
      }),
    })

    await wrapper.get('[data-testid="year-from-decrement"]').trigger('click')
    await wrapper.get('[data-testid="year-to-increment"]').trigger('click')
    const yearFromInput = wrapper.get('[data-testid="year-from-input"]')
    const yearToInput = wrapper.get('[data-testid="year-to-input"]')
    await yearFromInput.setValue('')
    await yearToInput.setValue('2023.6')

    const emissions = wrapper
      .emitted('update:modelValue')
      ?.map(([payload]) => payload as FilterModel)
    expect(emissions?.[0].yearFrom).toBe(1900)
    expect(emissions?.[1].yearTo).toBe(2031)
    expect(emissions?.[2].yearFrom).toBeNull()
    expect(emissions?.[3].yearTo).toBe(2024)
  })

  it('emits media, rating, and clear interactions', async () => {
    const wrapper = renderFilterBar({
      showMediaType: true,
      showRatingRange: true,
      activeFilterCount: 2,
      modelValue: createModelValue(),
    })

    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'Movies')
      ?.trigger('click')

    const numberInputs = wrapper.findAll('input[type="number"]')
    await numberInputs[0].setValue('2.5')
    await numberInputs[1].setValue('4.5')

    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'Clear filters')
      ?.trigger('click')

    const updatePayloads = wrapper
      .emitted('update:modelValue')
      ?.map(([payload]) => payload as FilterModel)
    expect(updatePayloads?.some((payload) => payload.mediaType === 'movie')).toBe(true)
    expect(updatePayloads?.some((payload) => payload.ratingMin === 2.5)).toBe(true)
    expect(updatePayloads?.some((payload) => payload.ratingMax === 4.5)).toBe(true)
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('renders rating controls with the compact stepper treatment', async () => {
    const wrapper = renderFilterBar({
      showRatingRange: true,
      compactClear: true,
      activeFilterCount: 1,
      modelValue: createModelValue({ ratingMin: 2.5, ratingMax: 4.5 }),
    })

    const ratingMinControl = wrapper.get('[data-testid="rating-min-control"]')
    const ratingMinInput = wrapper.get('[data-testid="rating-min-input"]')
    const ratingMaxControl = wrapper.get('[data-testid="rating-max-control"]')
    const ratingMaxInput = wrapper.get('[data-testid="rating-max-input"]')
    const clearButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Clear filters')

    expect(ratingMinControl.classes()).toContain('h-9')
    expect(ratingMaxControl.classes()).toContain('h-9')
    expect(ratingMinInput.classes()).toContain('h-full')
    expect(ratingMinInput.classes()).toContain('w-12')
    expect(ratingMinInput.classes()).not.toContain('w-16')
    expect(ratingMaxInput.classes()).toContain('w-12')
    expect(ratingMaxInput.classes()).not.toContain('w-16')
    expect(clearButton?.classes()).toContain('h-8')
    expect(clearButton?.classes()).toContain('text-xs')
    expect(clearButton?.classes()).not.toContain('ml-auto')

    await wrapper.get('[data-testid="rating-min-increment"]').trigger('click')
    await wrapper.get('[data-testid="rating-max-decrement"]').trigger('click')
    await ratingMinInput.setValue('6')

    const updatePayloads = wrapper
      .emitted('update:modelValue')
      ?.map(([payload]) => payload as FilterModel)
    expect(updatePayloads?.some((payload) => payload.ratingMin === 3)).toBe(true)
    expect(updatePayloads?.some((payload) => payload.ratingMax === 4)).toBe(true)
    expect(updatePayloads?.some((payload) => payload.ratingMin === 5)).toBe(true)
  })

  it('uses the current year when stepping an empty year control', async () => {
    const wrapper = renderFilterBar({
      showYearRange: true,
      modelValue: createModelValue({ yearFrom: null }),
    })

    await wrapper.get('[data-testid="year-from-increment"]').trigger('click')

    const updatePayloads = wrapper
      .emitted('update:modelValue')
      ?.map(([payload]) => payload as FilterModel)
    expect(updatePayloads?.some((payload) => payload.yearFrom === 2027)).toBe(true)
  })
})
