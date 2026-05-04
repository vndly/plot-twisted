/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PersonScreen from '@/presentation/views/person-screen.vue'
import { usePerson } from '@/application/use-person'
import { useToast } from '@/presentation/composables/use-toast'
import { useRoute, useRouter } from 'vue-router'

const personData = ref<any>(null)
const loading = ref(false)
const error = ref<Error | null>(null)
const refresh = vi.fn()
const addToast = vi.fn()
const push = vi.fn()
const back = vi.fn()
const routeId = ref('287')

vi.mock('@/application/use-person', () => ({
  usePerson: vi.fn(),
}))

vi.mock('@/presentation/composables/use-toast', () => ({
  useToast: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
  RouterLink: {
    props: ['to'],
    template: '<a :href="to"><slot /></a>',
  },
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  flatJson: true,
  messages: {
    en: {
      'person.back': 'Back',
      'person.backToHome': 'Back to Home',
      'person.error': 'Unable to load person details',
      'person.error.network': 'Network error while loading person details.',
      'person.error.server': 'Server error while loading person details.',
      'person.notFound': 'Person not found',
      'person.retry': 'Retry',
    },
  },
})

function renderPersonScreen() {
  return mount(PersonScreen, {
    global: {
      plugins: [i18n],
      stubs: {
        PersonHero: {
          props: ['name', 'knownForDepartment', 'profileUrl', 'birthInfo', 'deathInfo', 'links'],
          template:
            '<div data-testid="person-hero">{{ name }}|{{ knownForDepartment }}|{{ birthInfo }}|{{ deathInfo }}|links:{{ links.length }}</div>',
        },
        PersonBio: {
          props: ['biography'],
          template: '<section data-testid="person-bio">{{ biography }}</section>',
        },
        FilmographyGrid: {
          props: ['credits'],
          template: '<section data-testid="filmography-grid">{{ credits.length }}</section>',
        },
        PersonSkeleton: {
          template: '<div data-testid="person-skeleton"></div>',
        },
      },
    },
  })
}

describe('PersonScreen', () => {
  const originalHistory = window.history

  beforeEach(() => {
    personData.value = null
    loading.value = false
    error.value = null
    routeId.value = '287'
    refresh.mockReset()
    addToast.mockReset()
    push.mockReset()
    back.mockReset()
    vi.mocked(usePerson).mockReturnValue({ data: personData, loading, error, refresh } as any)
    vi.mocked(useToast).mockReturnValue({ addToast } as any)
    vi.mocked(useRoute).mockReturnValue({ params: { id: routeId.value } } as any)
    vi.mocked(useRouter).mockReturnValue({ push, back } as any)
    Object.defineProperty(window, 'history', {
      configurable: true,
      value: { length: 2 },
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'history', {
      configurable: true,
      value: originalHistory,
    })
  })

  it('renders skeleton with live region while loading', () => {
    // Arrange
    loading.value = true

    // Act
    const wrapper = renderPersonScreen()

    // Assert
    const region = wrapper.get('[data-testid="person-loading-region"]')
    expect(region.attributes('aria-live')).toBe('polite')
    expect(wrapper.find('[data-testid="person-skeleton"]').exists()).toBe(true)
  })

  it('renders person data in semantic article and sections', () => {
    // Arrange
    personData.value = {
      id: 287,
      name: 'Brad Pitt',
      knownForDepartment: 'Acting',
      biography: 'An actor and producer.',
      profileUrl: '/profile.jpg',
      birthInfo: 'December 18, 1963 - Shawnee, Oklahoma, USA',
      deathInfo: null,
      externalLinks: [{ type: 'imdb', url: 'https://www.imdb.com/name/nm0000093' }],
      filmography: [{ id: 550 }],
    }

    // Act
    const wrapper = renderPersonScreen()

    // Assert
    expect(wrapper.find('article').exists()).toBe(true)
    expect(wrapper.text()).toContain('Brad Pitt')
    expect(wrapper.find('[data-testid="person-hero"]').text()).toContain(
      'December 18, 1963 - Shawnee, Oklahoma, USA',
    )
    expect(wrapper.find('[data-testid="person-hero"]').text()).toContain('links:1')
    expect(wrapper.find('[data-testid="person-bio"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="filmography-grid"]').text()).toBe('1')
  })

  it('renders large filmographies without dropping items', () => {
    // Arrange
    personData.value = {
      id: 287,
      name: 'Brad Pitt',
      knownForDepartment: 'Acting',
      biography: null,
      profileUrl: null,
      birthInfo: null,
      deathInfo: null,
      externalLinks: [],
      filmography: Array.from({ length: 120 }, (_, id) => ({ id })),
    }

    // Act
    const wrapper = renderPersonScreen()

    // Assert
    expect(wrapper.find('[data-testid="filmography-grid"]').text()).toBe('120')
  })

  it('shows localized 404 state with Home link and alert semantics', async () => {
    // Arrange
    error.value = new Error('API request failed: 404 Not Found')

    // Act
    const wrapper = renderPersonScreen()

    // Assert
    const alert = wrapper.get('[role="alert"]')
    expect(alert.text()).toContain('Person not found')
    await wrapper.get('[data-testid="person-home-link"]').trigger('click')
    expect(push).toHaveBeenCalledWith('/')
  })

  it('dispatches network error toast with retry action', () => {
    // Arrange
    error.value = new Error('Network error')

    // Act
    renderPersonScreen()

    // Assert
    expect(addToast).toHaveBeenCalledWith({
      message: 'Network error while loading person details.',
      type: 'error',
      action: { label: 'Retry', handler: refresh },
    })
  })

  it('dispatches server error toast with retry action', () => {
    // Arrange
    error.value = new Error('API request failed: 500 Internal Server Error')

    // Act
    renderPersonScreen()

    // Assert
    expect(addToast).toHaveBeenCalledWith({
      message: 'Server error while loading person details.',
      type: 'error',
      action: { label: 'Retry', handler: refresh },
    })
  })

  it('uses route ID and omits the previous back button', () => {
    // Arrange
    personData.value = {
      id: 287,
      name: 'Brad Pitt',
      knownForDepartment: 'Acting',
      biography: null,
      profileUrl: null,
      birthInfo: null,
      deathInfo: null,
      externalLinks: [],
      filmography: [],
    }

    // Act
    const wrapper = renderPersonScreen()

    // Assert
    const personIdArg = vi.mocked(usePerson).mock.calls.at(-1)?.[0] as { value: number }
    expect(personIdArg.value).toBe(287)
    expect(wrapper.find('[data-testid="person-back-button"]').exists()).toBe(false)
    expect(back).not.toHaveBeenCalled()
  })

  it('calls refresh when retry button is clicked for non-404 errors', async () => {
    // Arrange
    error.value = new Error('API request failed: 500 Internal Server Error')

    // Act
    const wrapper = renderPersonScreen()
    await wrapper.get('[data-testid="person-retry-button"]').trigger('click')

    // Assert
    expect(refresh).toHaveBeenCalled()
  })

  it('does not dispatch toast for 404 errors', () => {
    // Arrange
    error.value = new Error('API request failed: 404 Not Found')

    // Act
    renderPersonScreen()

    // Assert - no toast should be shown for 404
    expect(addToast).not.toHaveBeenCalled()
  })

  it('does not dispatch toast for 429 rate limit errors', () => {
    // Arrange
    error.value = new Error('API request failed: 429 Too Many Requests')

    // Act
    renderPersonScreen()

    // Assert - no toast should be shown for rate limit
    expect(addToast).not.toHaveBeenCalled()
  })

  it('handles errors with numeric status property for 404', () => {
    // Arrange - test error with status property
    const errorWithStatus = new Error('Not Found') as Error & { status: number }
    errorWithStatus.status = 404
    error.value = errorWithStatus

    // Act
    const wrapper = renderPersonScreen()

    // Assert - should show not found state
    expect(wrapper.text()).toContain('Person not found')
    expect(addToast).not.toHaveBeenCalled()
  })

  it('handles errors with numeric status property for 429', () => {
    // Arrange - test error with status property
    const errorWithStatus = new Error('Too Many Requests') as Error & { status: number }
    errorWithStatus.status = 429
    error.value = errorWithStatus

    // Act
    renderPersonScreen()

    // Assert - should not show toast for rate limit
    expect(addToast).not.toHaveBeenCalled()
  })

  it('handles errors with numeric status property for 5xx', () => {
    // Arrange - test error with status property for server error
    const errorWithStatus = new Error('Server Error') as Error & { status: number }
    errorWithStatus.status = 503
    error.value = errorWithStatus

    // Act
    renderPersonScreen()

    // Assert - should show server error toast
    expect(addToast).toHaveBeenCalledWith({
      message: 'Server error while loading person details.',
      type: 'error',
      action: { label: 'Retry', handler: refresh },
    })
  })

  it('handles errors with non-numeric status property', () => {
    // Arrange - test error with non-numeric status
    const errorWithStringStatus = new Error('Server Error') as Error & { status: string }
    ;(errorWithStringStatus as any).status = 'not-a-number'
    error.value = errorWithStringStatus

    // Act
    renderPersonScreen()

    // Assert - should not crash and should handle gracefully
    expect(addToast).not.toHaveBeenCalled()
  })

  it('handles null error state without crashing', () => {
    // Arrange
    error.value = null

    // Act
    const wrapper = renderPersonScreen()

    // Assert - should not crash
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('detects server error from message when status property is not present', () => {
    // Arrange - test error without status property but with 5xx in message
    error.value = new Error('Server responded with 503 Service Unavailable')

    // Act
    renderPersonScreen()

    // Assert - should show server error toast
    expect(addToast).toHaveBeenCalledWith({
      message: 'Server error while loading person details.',
      type: 'error',
      action: { label: 'Retry', handler: refresh },
    })
  })

  it('handles generic error without network or server keywords', () => {
    // Arrange - error without specific keywords (not network, not server, not 404, not 429)
    error.value = new Error('Unknown error occurred')

    // Act
    renderPersonScreen()

    // Assert - should not dispatch toast for unrecognized error types
    expect(addToast).not.toHaveBeenCalled()
  })

  it('detects 404 error from message when errorStatus is null', () => {
    // Arrange - error without status but with 404 in message
    error.value = new Error('Resource not found 404')

    // Act
    const wrapper = renderPersonScreen()

    // Assert - should show not found state
    expect(wrapper.text()).toContain('Person not found')
  })

  it('detects 429 error from message when errorStatus is null', () => {
    // Arrange - error without status but with 429 in message
    error.value = new Error('Rate limited 429')

    // Act
    renderPersonScreen()

    // Assert - should not show toast
    expect(addToast).not.toHaveBeenCalled()
  })

  it('evaluates error computed properties with ?? false fallbacks when error is null', async () => {
    // Arrange - start with an error then clear it
    error.value = new Error('test error')

    // Act
    const wrapper = renderPersonScreen()

    // Assert - alert should exist
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)

    // Now clear the error
    error.value = null
    await wrapper.vm.$nextTick()

    // The ?? false fallbacks should now be evaluated when error is null
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('transitions from error to person data state', async () => {
    // Arrange - start with error
    error.value = new Error('Network error')

    // Act
    const wrapper = renderPersonScreen()
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)

    // Clear error and set person data
    error.value = null
    personData.value = {
      id: 287,
      name: 'Brad Pitt',
      knownForDepartment: 'Acting',
      biography: 'An actor.',
      profileUrl: '/profile.jpg',
      birthInfo: null,
      deathInfo: null,
      externalLinks: [],
      filmography: [],
    }
    await wrapper.vm.$nextTick()

    // Assert - should show person data
    expect(wrapper.text()).toContain('Brad Pitt')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('handles message check when error message does not contain error codes', () => {
    // Arrange - error message without any error codes
    error.value = new Error('Something went wrong')

    // Act
    const wrapper = renderPersonScreen()

    // Assert - should show generic error state, not 404 or rate limited
    expect(wrapper.text()).toContain('Unable to load person details')
    expect(wrapper.text()).not.toContain('Person not found')
  })

  it('evaluates computed error flags when error transitions to null', async () => {
    // Arrange - set an error first
    error.value = new Error('test')

    // Act
    const wrapper = renderPersonScreen()
    const vm = wrapper.vm as any

    // Assert - with error set
    expect(vm.isNotFound).toBe(false)
    expect(vm.isRateLimited).toBe(false)
    expect(vm.isServerError).toBe(false)
    expect(vm.isNetworkError).toBe(false)

    // Now clear error to force ?? false branches
    error.value = null
    await wrapper.vm.$nextTick()

    // The computed properties should now use the ?? false fallback
    // since error.value?.message is undefined when error.value is null
    expect(vm.isNotFound).toBe(false)
    expect(vm.isRateLimited).toBe(false)
    expect(vm.isServerError).toBe(false)
    expect(vm.isNetworkError).toBe(false)
  })
})
