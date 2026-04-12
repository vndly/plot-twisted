/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useUpcomingMovies } from '@/application/use-upcoming-movies'
import * as providerClient from '@/infrastructure/provider.client'
import type { MovieListItem } from '@/domain/movie.schema'
import type { PaginatedResponse } from '@/domain/shared.schema'

// Mock the provider client
vi.mock('@/infrastructure/provider.client', () => ({
  getUpcomingMovies: vi.fn(),
}))

// Mock useSettings
vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language: { value: 'en' },
    preferredRegion: { value: 'US' },
  }),
}))

/** Helper component to test the composable. */
const TestComponent = defineComponent({
  props: {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
  },
  setup(props) {
    return { ...useUpcomingMovies(props.year, props.month) }
  },
  template: '<div></div>',
})

describe('useUpcomingMovies', () => {
  const mockResponsePage1: PaginatedResponse<MovieListItem> = {
    page: 1,
    results: [{ id: 1, title: 'Movie 1', release_date: '2026-04-05' } as any],
    total_pages: 2,
    total_results: 2,
  }

  const mockResponsePage2: PaginatedResponse<MovieListItem> = {
    page: 2,
    results: [{ id: 2, title: 'Movie 2', release_date: '2026-04-25' } as any],
    total_pages: 2,
    total_results: 2,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches upcoming movies for the specified month (FR-06-04)', async () => {
    const singlePageResponse = { ...mockResponsePage1, total_pages: 1 }
    vi.mocked(providerClient.getUpcomingMovies).mockResolvedValue(singlePageResponse)

    const wrapper = mount(TestComponent, {
      props: { year: 2026, month: 3 }, // April
    })
    const vm = wrapper.vm as any

    expect(vm.loading).toBe(true)
    await nextTick()
    await nextTick()

    expect(vm.loading).toBe(false)
    expect(vm.movies).toHaveLength(1)
    expect(vm.movies[0].id).toBe(1)
    expect(providerClient.getUpcomingMovies).toHaveBeenCalledWith('en', 'US', 1)
  })

  it('performs multi-page fetching if needed (FR-06-04)', async () => {
    vi.mocked(providerClient.getUpcomingMovies)
      .mockResolvedValueOnce(mockResponsePage1)
      .mockResolvedValueOnce(mockResponsePage2)

    const wrapper = mount(TestComponent, {
      props: { year: 2026, month: 3 },
    })
    const vm = wrapper.vm as any

    await nextTick()
    await nextTick()
    await nextTick()

    expect(vm.movies).toHaveLength(2)
    expect(vm.movies[1].id).toBe(2)
    expect(providerClient.getUpcomingMovies).toHaveBeenCalledTimes(2)
  })

  it('handles API errors (FR-06-08)', async () => {
    vi.mocked(providerClient.getUpcomingMovies).mockRejectedValue(new Error('API Error'))

    const wrapper = mount(TestComponent, {
      props: { year: 2026, month: 3 },
    })
    const vm = wrapper.vm as any

    await nextTick()
    await nextTick()

    expect(vm.loading).toBe(false)
    expect(vm.error).toBeDefined()
    expect(vm.error?.message).toBe('API Error')
  })
})
