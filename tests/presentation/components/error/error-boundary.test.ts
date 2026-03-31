import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { defineComponent, h } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ErrorBoundary from '@/presentation/components/error/error-boundary.vue'
import { _resetForTesting, useToast } from '@/presentation/composables/use-toast'

/**
 * Creates a vue-i18n instance for component testing.
 */
function createTestI18n() {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'common.error.title': 'Something went wrong',
        'common.error.description': 'An unexpected error occurred.',
        'common.error.reload': 'Reload',
      },
    },
  })
}

const FailingChild = defineComponent({
  name: 'FailingChild',
  setup() {
    return () => {
      throw new Error('Boundary failure')
    }
  },
})

describe('ErrorBoundary', () => {
  beforeEach(() => {
    _resetForTesting()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // SC-24-03
  it('renders slot content in normal state', () => {
    // Arrange
    const i18n = createTestI18n()

    // Act
    const wrapper = mount(ErrorBoundary, {
      global: { plugins: [i18n] },
      slots: {
        default: '<div data-testid="safe-child">Safe child</div>',
      },
    })

    // Assert
    expect(wrapper.get('[data-testid="safe-child"]').text()).toBe('Safe child')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  // SC-18-01, SC-24-06
  it('shows the full-screen fallback UI with translated copy and role="alert" when a child throws', async () => {
    // Arrange
    const i18n = createTestI18n()

    // Act
    const wrapper = mount(ErrorBoundary, {
      global: { plugins: [i18n] },
      slots: {
        default: () => h(FailingChild),
      },
    })
    await flushPromises()

    // Assert
    const fallback = wrapper.get('[role="alert"]')
    expect(fallback.text()).toContain('Something went wrong')
    expect(fallback.text()).toContain('An unexpected error occurred.')
    expect(fallback.text()).toContain('Reload')
    expect(fallback.classes()).toContain('min-h-screen')
    expect(fallback.classes()).toContain('items-center')
    expect(fallback.classes()).toContain('justify-center')
  })

  // SC-18-02
  it('calls window.location.reload when the reload button is clicked', async () => {
    // Arrange
    const i18n = createTestI18n()
    const reloadSpy = vi.fn()

    const wrapper = mount(ErrorBoundary, {
      props: {
        reloadPage: reloadSpy,
      },
      global: { plugins: [i18n] },
      slots: {
        default: () => h(FailingChild),
      },
    })
    await flushPromises()

    // Act
    await wrapper.get('[data-testid="error-boundary-reload"]').trigger('click')

    // Assert
    expect(reloadSpy).toHaveBeenCalledOnce()
  })

  // SC-18-03
  it('prevents propagation to the global error handler and does not dispatch a toast', async () => {
    // Arrange
    const i18n = createTestI18n()
    const errorHandlerSpy = vi.fn()
    const { toasts } = useToast()

    // Act
    mount(ErrorBoundary, {
      global: {
        plugins: [i18n],
        config: { errorHandler: errorHandlerSpy },
      },
      slots: {
        default: () => h(FailingChild),
      },
    })
    await flushPromises()

    // Assert
    expect(errorHandlerSpy).not.toHaveBeenCalled()
    expect(toasts.value).toHaveLength(0)
  })
})
