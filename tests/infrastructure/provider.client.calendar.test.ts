import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getUpcomingMovies } from '@/infrastructure/provider.client'

describe('getUpcomingMovies', () => {
  const mockFetch = vi.fn()
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = mockFetch
    mockFetch.mockReset()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  const mockUpcomingResponse = {
    page: 1,
    results: [
      {
        id: 1,
        title: 'Upcoming Movie',
        release_date: '2026-05-01',
        poster_path: '/path.jpg',
        backdrop_path: '/backdrop.jpg',
        vote_average: 7.5,
        vote_count: 100,
        popularity: 50.0,
        genre_ids: [28],
        adult: false,
        original_language: 'en',
        video: false,
      },
    ],
    total_pages: 1,
    total_results: 1,
  }

  it('constructs correct URL with language, region, and page (FR-06-04-01)', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUpcomingResponse),
    })

    // Act
    await getUpcomingMovies('en', 'US', 1)

    // Assert
    const url = new URL(mockFetch.mock.calls[0][0])
    expect(url.pathname).toBe('/3/movie/upcoming')
    expect(url.searchParams.get('language')).toBe('en')
    expect(url.searchParams.get('region')).toBe('US')
    expect(url.searchParams.get('page')).toBe('1')
  })

  it('returns validated response', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUpcomingResponse),
    })

    // Act
    const result = await getUpcomingMovies('en', 'US', 1)

    // Assert
    expect(result.page).toBe(1)
    expect(result.results).toHaveLength(1)
    expect(result.results[0].id).toBe(1)
    expect(result.results[0].release_date).toBe('2026-05-01')
  })

  it('throws error on API failure', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })

    // Act & Assert
    await expect(getUpcomingMovies('en', 'US', 1)).rejects.toThrow(
      'API request failed: 500 Internal Server Error',
    )
  })
})
