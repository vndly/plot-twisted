import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { usePerson } from '@/application/use-person'
import { getPersonDetail } from '@/infrastructure/provider.client'

vi.mock('@/infrastructure/provider.client', () => ({
  getPersonDetail: vi.fn(),
}))

const language = ref('en')

vi.mock('@/application/use-settings', () => ({
  useSettings: () => ({
    language,
  }),
}))

const mockGetPersonDetail = vi.mocked(getPersonDetail)

const mockPersonDetail = {
  id: 287,
  name: 'Brad Pitt',
  biography: 'An actor and producer.',
  birthday: '1963-12-18',
  deathday: null,
  place_of_birth: 'Shawnee, Oklahoma, USA',
  profile_path: '/profile.jpg',
  known_for_department: 'Acting',
  also_known_as: ['William Bradley Pitt'],
  homepage: null,
  combined_credits: {
    cast: [
      {
        id: 1,
        media_type: 'movie' as const,
        title: 'Older Movie',
        character: 'Role A',
        release_date: '1999-10-15',
        poster_path: '/older.jpg',
        vote_average: 7.5,
        order: 1,
      },
      {
        id: 2,
        media_type: 'tv' as const,
        name: 'Newest Show',
        character: 'Role B',
        first_air_date: '2024-02-01',
        poster_path: '/newest.jpg',
        vote_average: 8.2,
        order: 1,
      },
      {
        id: 1,
        media_type: 'movie' as const,
        title: 'Older Movie',
        character: 'Duplicate Better Billing',
        release_date: '1999-10-15',
        poster_path: '/older.jpg',
        vote_average: 7.5,
        order: 0,
      },
      {
        id: 3,
        media_type: 'movie' as const,
        title: 'Undated Movie',
        character: null,
        release_date: null,
        poster_path: null,
        vote_average: 0,
        order: null,
      },
    ],
  },
  external_ids: {
    imdb_id: 'nm0000093',
    instagram_id: 'bradpitt',
    twitter_id: null,
  },
}

async function flushPromises() {
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 0))
}

describe('usePerson', () => {
  beforeEach(() => {
    language.value = 'en'
    mockGetPersonDetail.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('transitions from idle to loading to success with person page data', async () => {
    // Arrange
    let resolvePerson!: (value: typeof mockPersonDetail) => void
    mockGetPersonDetail.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePerson = resolve
      }),
    )

    // Act
    const { data, loading, error } = usePerson(287)
    await nextTick()

    // Assert
    expect(loading.value).toBe(true)
    expect(data.value).toBeNull()
    expect(error.value).toBeNull()

    // Act
    resolvePerson(mockPersonDetail)
    await flushPromises()

    // Assert
    expect(loading.value).toBe(false)
    expect(data.value?.id).toBe(287)
    expect(data.value?.name).toBe('Brad Pitt')
    expect(error.value).toBeNull()
  })

  it('transitions from idle to loading to error with error populated', async () => {
    // Arrange
    mockGetPersonDetail.mockRejectedValueOnce(new Error('Network error'))

    // Act
    const { data, loading, error } = usePerson(287)
    await flushPromises()

    // Assert
    expect(loading.value).toBe(false)
    expect(data.value).toBeNull()
    expect(error.value?.message).toBe('Network error')
  })

  it('exposes server errors for manual retry', async () => {
    // Arrange
    mockGetPersonDetail.mockRejectedValueOnce(new Error('API request failed: 500 Server Error'))

    // Act
    const { error } = usePerson(287)
    await flushPromises()

    // Assert
    expect(error.value?.message).toContain('500')
  })

  it('refresh re-fetches data after an error', async () => {
    // Arrange
    mockGetPersonDetail
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockPersonDetail)

    const { data, error, refresh } = usePerson(287)
    await flushPromises()
    expect(error.value).not.toBeNull()

    // Act
    refresh()
    await flushPromises()

    // Assert
    expect(mockGetPersonDetail).toHaveBeenCalledTimes(2)
    expect(error.value).toBeNull()
    expect(data.value?.name).toBe('Brad Pitt')
  })

  it('passes the current Settings.language to getPersonDetail', async () => {
    // Arrange
    language.value = 'fr'
    mockGetPersonDetail.mockResolvedValueOnce(mockPersonDetail)

    // Act
    usePerson(287)
    await flushPromises()

    // Assert
    expect(mockGetPersonDetail).toHaveBeenCalledWith(287, 'fr')
  })

  it('refetches the same person when Settings.language changes', async () => {
    // Arrange
    mockGetPersonDetail.mockResolvedValue(mockPersonDetail)
    usePerson(287)
    await flushPromises()

    // Act
    language.value = 'es'
    await flushPromises()

    // Assert
    expect(mockGetPersonDetail).toHaveBeenCalledWith(287, 'es')
  })

  it('deduplicates and sorts filmography before Presentation receives it', async () => {
    // Arrange
    mockGetPersonDetail.mockResolvedValueOnce(mockPersonDetail)

    // Act
    const { data } = usePerson(287)
    await flushPromises()

    // Assert
    expect(data.value?.filmography.map((credit) => credit.id)).toEqual([2, 1, 3])
    expect(data.value?.filmography[1].character).toBe('Duplicate Better Billing')
    expect(data.value?.filmography[2].releaseYear).toBeNull()
  })

  it('builds formatted dates, external links, profile URL, and poster URLs', async () => {
    // Arrange
    mockGetPersonDetail.mockResolvedValueOnce(mockPersonDetail)

    // Act
    const { data } = usePerson(287)
    await flushPromises()

    // Assert
    expect(data.value?.birthInfo).toContain('December')
    expect(data.value?.birthInfo).toContain('Shawnee, Oklahoma, USA')
    expect(data.value?.deathInfo).toBeNull()
    expect(data.value?.profileUrl).toContain('/w185/profile.jpg')
    expect(data.value?.externalLinks).toEqual([
      { type: 'imdb', url: 'https://www.imdb.com/name/nm0000093' },
      { type: 'instagram', url: 'https://www.instagram.com/bradpitt' },
    ])
    expect(data.value?.filmography[0].posterUrl).toContain('/w185/newest.jpg')
    expect(data.value?.filmography[0].route).toBe('/show/2')
    expect(data.value?.filmography[1].route).toBe('/movie/1')
  })

  it('refetches when the person ID ref changes', async () => {
    // Arrange
    const personId = ref(287)
    mockGetPersonDetail.mockResolvedValue(mockPersonDetail)
    usePerson(personId)
    await flushPromises()

    // Act
    personId.value = 288
    await flushPromises()

    // Assert
    expect(mockGetPersonDetail).toHaveBeenCalledTimes(2)
    expect(mockGetPersonDetail).toHaveBeenLastCalledWith(288, 'en')
  })

  it('builds external links including Twitter when available', async () => {
    // Arrange
    const personWithTwitter = {
      ...mockPersonDetail,
      external_ids: {
        imdb_id: 'nm0000093',
        instagram_id: null,
        twitter_id: 'bradpitt',
      },
    }
    mockGetPersonDetail.mockResolvedValueOnce(personWithTwitter)

    // Act
    const { data } = usePerson(287)
    await flushPromises()

    // Assert
    expect(data.value?.externalLinks).toEqual([
      { type: 'imdb', url: 'https://www.imdb.com/name/nm0000093' },
      { type: 'twitter', url: 'https://twitter.com/bradpitt' },
    ])
  })

  it('returns empty external links when no supported IDs exist', async () => {
    // Arrange
    const personNoLinks = {
      ...mockPersonDetail,
      external_ids: {
        imdb_id: null,
        instagram_id: null,
        twitter_id: null,
      },
    }
    mockGetPersonDetail.mockResolvedValueOnce(personNoLinks)

    // Act
    const { data } = usePerson(287)
    await flushPromises()

    // Assert
    expect(data.value?.externalLinks).toEqual([])
  })

  it('ignores stale responses when person ID changes rapidly', async () => {
    // Arrange
    const personId = ref(287)
    let resolveFirst!: (value: typeof mockPersonDetail) => void
    let resolveSecond!: (value: typeof mockPersonDetail) => void

    mockGetPersonDetail
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFirst = resolve
        }),
      )
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveSecond = resolve
        }),
      )

    const { data, loading } = usePerson(personId)
    await nextTick()

    // Change ID before first request completes
    personId.value = 288
    await nextTick()

    // Resolve second request first
    resolveSecond({ ...mockPersonDetail, name: 'Second Person' })
    await flushPromises()

    // Assert second request populates data
    expect(data.value?.name).toBe('Second Person')

    // Resolve first (stale) request
    resolveFirst({ ...mockPersonDetail, name: 'First Person' })
    await flushPromises()

    // Assert stale response is ignored
    expect(data.value?.name).toBe('Second Person')
    expect(loading.value).toBe(false)
  })

  it('ignores stale error responses when person ID changes rapidly', async () => {
    // Arrange
    const personId = ref(287)
    let rejectFirst!: (error: Error) => void
    let resolveSecond!: (value: typeof mockPersonDetail) => void

    mockGetPersonDetail
      .mockReturnValueOnce(
        new Promise((_, reject) => {
          rejectFirst = reject
        }),
      )
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveSecond = resolve
        }),
      )

    const { data, error } = usePerson(personId)
    await nextTick()

    // Change ID before first request completes
    personId.value = 288
    await nextTick()

    // Resolve second request first
    resolveSecond({ ...mockPersonDetail, name: 'Second Person' })
    await flushPromises()

    // Assert second request populates data
    expect(data.value?.name).toBe('Second Person')
    expect(error.value).toBeNull()

    // Reject first (stale) request
    rejectFirst(new Error('Network error'))
    await flushPromises()

    // Assert stale error is ignored
    expect(data.value?.name).toBe('Second Person')
    expect(error.value).toBeNull()
  })

  it('wraps non-Error exceptions in a generic Error', async () => {
    // Arrange
    mockGetPersonDetail.mockRejectedValueOnce('string error')

    // Act
    const { error } = usePerson(287)
    await flushPromises()

    // Assert
    expect(error.value?.message).toBe('Failed to fetch person details')
  })

  it('returns non-ISO formatted dates as-is', async () => {
    // Arrange
    const personWithNonIsoDate = {
      ...mockPersonDetail,
      birthday: '1963', // Non-ISO format (just year)
      deathday: null,
    }
    mockGetPersonDetail.mockResolvedValueOnce(personWithNonIsoDate)

    // Act
    const { data } = usePerson(287)
    await flushPromises()

    // Assert - birthday should be returned as-is since it's not in YYYY-MM-DD format
    expect(data.value?.birthInfo).toContain('1963')
  })

  it('returns place of birth when birthday is null', async () => {
    // Arrange
    const personWithOnlyPlace = {
      ...mockPersonDetail,
      birthday: null,
      place_of_birth: 'Los Angeles, CA',
    }
    mockGetPersonDetail.mockResolvedValueOnce(personWithOnlyPlace)

    // Act
    const { data } = usePerson(287)
    await flushPromises()

    // Assert - should show only place of birth
    expect(data.value?.birthInfo).toBe('Los Angeles, CA')
  })

  it('returns only birthday when place of birth is null', async () => {
    // Arrange
    const personWithOnlyBirthday = {
      ...mockPersonDetail,
      birthday: '1963-12-18',
      place_of_birth: null,
    }
    mockGetPersonDetail.mockResolvedValueOnce(personWithOnlyBirthday)

    // Act
    const { data } = usePerson(287)
    await flushPromises()

    // Assert - should show only formatted birthday
    expect(data.value?.birthInfo).toContain('December')
    expect(data.value?.birthInfo).not.toContain(' - ')
  })

  it('returns null biography when biography is whitespace only', async () => {
    // Arrange
    const personWithWhitespaceBio = {
      ...mockPersonDetail,
      biography: '   ',
    }
    mockGetPersonDetail.mockResolvedValueOnce(personWithWhitespaceBio)

    // Act
    const { data } = usePerson(287)
    await flushPromises()

    // Assert - biography should be null when it's only whitespace
    expect(data.value?.biography).toBeNull()
  })

  it('handles Instagram-only external links', async () => {
    // Arrange
    const personWithInstagramOnly = {
      ...mockPersonDetail,
      external_ids: {
        imdb_id: null,
        instagram_id: 'actor',
        twitter_id: null,
      },
    }
    mockGetPersonDetail.mockResolvedValueOnce(personWithInstagramOnly)

    // Act
    const { data } = usePerson(287)
    await flushPromises()

    // Assert
    expect(data.value?.externalLinks).toEqual([
      { type: 'instagram', url: 'https://www.instagram.com/actor' },
    ])
  })
})
