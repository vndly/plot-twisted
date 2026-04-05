import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EntryGrid from '@/presentation/components/common/entry-grid.vue'
import MovieCard from '@/presentation/components/common/movie-card.vue'
import type { LibraryEntry } from '@/domain/library.schema'

describe('EntryGrid', () => {
  const entries: LibraryEntry[] = [
    {
      id: 1,
      mediaType: 'movie',
      title: 'Movie 1',
      posterPath: '/path1.jpg',
      rating: 4,
      favorite: false,
      status: 'watched',
      lists: [],
      tags: [],
      notes: '',
      watchDates: [],
      addedAt: '2024-01-01T00:00:00Z',
      // Added fields if I decide to add them to schema
      voteAverage: 8.5,
      releaseDate: '2024-01-01',
    } as unknown as LibraryEntry,
    {
      id: 2,
      mediaType: 'tv',
      title: 'Show 1',
      posterPath: '/path2.jpg',
      rating: 0,
      favorite: true,
      status: 'watchlist',
      lists: [],
      tags: [],
      notes: '',
      watchDates: [],
      addedAt: '2024-01-01T00:00:00Z',
      voteAverage: 7.2,
      releaseDate: '2023-01-01',
    } as unknown as LibraryEntry,
  ]

  it('renders a MovieCard for each entry provided', () => {
    // Act
    const wrapper = mount(EntryGrid, {
      props: {
        entries,
      },
    })

    // Assert
    const cards = wrapper.findAllComponents(MovieCard)
    expect(cards).toHaveLength(2)
  })

  it('renders nothing when entries array is empty', () => {
    // Act
    const wrapper = mount(EntryGrid, {
      props: {
        entries: [],
      },
    })

    // Assert
    expect(wrapper.findAllComponents(MovieCard)).toHaveLength(0)
    expect(wrapper.find('.empty-state').exists()).toBe(false) // EntryGrid shouldn't show empty state itself, usually handled by parent
  })
})
