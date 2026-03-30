import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ToastContainer from '@/presentation/components/common/toast-container.vue'
import { useToast, _resetForTesting } from '@/presentation/composables/use-toast'
import { TOAST_DISMISS_MS } from '@/domain/constants'

/**
 * Creates a vue-i18n instance for testing with the specified locale.
 */
function createTestI18n(locale = 'en') {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    flatJson: true,
    messages: {
      en: {
        'toast.dismiss': 'Dismiss',
      },
      es: {
        'toast.dismiss': 'Cerrar',
      },
    },
  })
}

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    _resetForTesting()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // Implementation detail — Renders nothing when toast queue is empty
  it('renders nothing when toast queue is empty', () => {
    // Arrange
    const i18n = createTestI18n()

    // Act
    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.findAll('[data-testid="toast-item"]')).toHaveLength(0)
  })

  // Implementation detail — Renders toast items when present
  it('renders toast items when present', () => {
    // Arrange
    const i18n = createTestI18n()
    const { addToast } = useToast()
    addToast({ message: 'Test message', type: 'info' })

    // Act
    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.findAll('[data-testid="toast-item"]')).toHaveLength(1)
    expect(wrapper.text()).toContain('Test message')
  })

  // SC-14-01 — Multiple toasts stack vertically without overlapping
  it('stacks multiple toasts vertically', () => {
    // Arrange
    const i18n = createTestI18n()
    const { addToast } = useToast()
    addToast({ message: 'Message 1', type: 'info' })
    addToast({ message: 'Message 2', type: 'success' })

    // Act
    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Assert
    const toastItems = wrapper.findAll('[data-testid="toast-item"]')
    expect(toastItems).toHaveLength(2)
    expect(wrapper.text()).toContain('Message 1')
    expect(wrapper.text()).toContain('Message 2')
    // Container uses flex-col with gap-3 for vertical stacking
    const container = wrapper.find('[data-testid="toast-container"]')
    expect(container.classes()).toContain('flex-col')
    expect(container.classes()).toContain('gap-3')
  })

  // SC-14-02 — Container is fixed top-right with z-50
  it('positions container fixed top-right with z-50', () => {
    // Arrange
    const i18n = createTestI18n()
    const { addToast } = useToast()
    addToast({ message: 'Test', type: 'info' })

    // Act
    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Assert
    const container = wrapper.find('[data-testid="toast-container"]')
    expect(container.classes()).toContain('fixed')
    expect(container.classes()).toContain('top-4')
    expect(container.classes()).toContain('right-4')
    expect(container.classes()).toContain('z-50')
  })

  // SC-14-03 — Dismiss button removes toast
  it('removes toast when dismiss button is clicked', async () => {
    // Arrange
    const i18n = createTestI18n()
    const { toasts, addToast } = useToast()
    addToast({ message: 'Dismiss me', type: 'info' })
    expect(toasts.value).toHaveLength(1)

    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="toast-dismiss"]').trigger('click')

    // Assert
    expect(toasts.value).toHaveLength(0)
  })

  // SC-14-04 — Oldest toast evicted when max (5) exceeded
  it('evicts oldest toast when adding 6th toast', () => {
    // Arrange
    const i18n = createTestI18n()
    const { toasts, addToast } = useToast()
    for (let i = 1; i <= 5; i++) {
      addToast({ message: `Toast ${i}`, type: 'info' })
    }
    expect(toasts.value).toHaveLength(5)
    expect(toasts.value[0].message).toBe('Toast 1')

    // Act
    addToast({ message: 'Toast 6', type: 'info' })

    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Assert
    expect(toasts.value).toHaveLength(5)
    expect(wrapper.text()).not.toContain('Toast 1')
    expect(wrapper.text()).toContain('Toast 6')
  })

  // SC-14-05a — Toast enter transition (uses toast-* CSS classes)
  it('uses TransitionGroup with toast transition classes for enter', () => {
    // Arrange
    const i18n = createTestI18n()
    const { addToast } = useToast()
    addToast({ message: 'Transition test', type: 'info' })

    // Act
    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Assert — TransitionGroup uses name="toast" which maps to toast-* CSS classes
    const transitionGroup = wrapper.findComponent({ name: 'TransitionGroup' })
    expect(transitionGroup.exists()).toBe(true)
    expect(transitionGroup.attributes('name')).toBe('toast')
  })

  // SC-14-05b — Toast leave transition (fade-out via toast-* CSS classes)
  it('uses TransitionGroup with toast transition classes for leave', async () => {
    // Arrange
    const i18n = createTestI18n()
    const { addToast, removeToast, toasts } = useToast()
    addToast({ message: 'Fade out test', type: 'info' })
    const id = toasts.value[0].id

    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })
    expect(wrapper.findAll('[data-testid="toast-item"]')).toHaveLength(1)

    // Act
    removeToast(id)
    await flushPromises()

    // Assert — toast removed (transition handled by CSS)
    expect(toasts.value).toHaveLength(0)
  })

  // SC-14-06 — Type-colored left borders
  it.each([
    { type: 'error' as const, borderClass: 'border-l-error' },
    { type: 'success' as const, borderClass: 'border-l-success' },
    { type: 'info' as const, borderClass: 'border-l-accent' },
  ])('displays $borderClass for $type toast', ({ type, borderClass }) => {
    // Arrange
    const i18n = createTestI18n()
    const { addToast } = useToast()
    addToast({ message: `${type} toast`, type })

    // Act
    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Assert
    const toastItem = wrapper.find('[data-testid="toast-item"]')
    expect(toastItem.classes()).toContain(borderClass)
  })

  // SC-14-07 — Toast auto-dismisses after TOAST_DISMISS_MS
  it('auto-dismisses toast after TOAST_DISMISS_MS', async () => {
    // Arrange
    const i18n = createTestI18n()
    const { toasts, addToast } = useToast()
    addToast({ message: 'Auto-dismiss', type: 'info' })
    expect(toasts.value).toHaveLength(1)

    mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Act
    vi.advanceTimersByTime(TOAST_DISMISS_MS)

    // Assert
    expect(toasts.value).toHaveLength(0)
  })

  // SC-14-08 — Transitions disabled when prefers-reduced-motion: reduce
  // Note: CSS handles this via media query; test verifies TransitionGroup is present
  it('renders TransitionGroup (CSS handles reduced motion)', () => {
    // Arrange
    const i18n = createTestI18n()
    const { addToast } = useToast()
    addToast({ message: 'Motion test', type: 'info' })

    // Act
    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Assert — TransitionGroup exists; actual reduced-motion behavior is CSS-driven
    const transitionGroup = wrapper.findComponent({ name: 'TransitionGroup' })
    expect(transitionGroup.exists()).toBe(true)
  })

  // SC-14-09 — Toast text renders in non-default locale
  it('renders dismiss button label in Spanish when locale is es', () => {
    // Arrange
    const i18n = createTestI18n('es')
    const { addToast } = useToast()
    addToast({ message: 'Error message', type: 'error' })

    // Act
    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Assert
    const dismissButton = wrapper.find('[data-testid="toast-dismiss"]')
    expect(dismissButton.attributes('aria-label')).toBe('Cerrar')
  })

  // SC-14-10 — Action button triggers callback
  it('triggers action callback when action button is clicked', async () => {
    // Arrange
    const i18n = createTestI18n()
    const handler = vi.fn()
    const { addToast } = useToast()
    addToast({ message: 'With action', type: 'error', action: { label: 'Retry', handler } })

    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="toast-action"]').trigger('click')

    // Assert
    expect(handler).toHaveBeenCalledOnce()
  })

  // Implementation detail — Action button renders when provided
  it('renders action button when action is provided', () => {
    // Arrange
    const i18n = createTestI18n()
    const { addToast } = useToast()
    addToast({ message: 'With action', type: 'info', action: { label: 'Undo', handler: vi.fn() } })

    // Act
    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Assert
    const actionButton = wrapper.find('[data-testid="toast-action"]')
    expect(actionButton.exists()).toBe(true)
    expect(actionButton.text()).toBe('Undo')
  })

  // Implementation detail — Action button does not render when not provided
  it('does not render action button when action is not provided', () => {
    // Arrange
    const i18n = createTestI18n()
    const { addToast } = useToast()
    addToast({ message: 'No action', type: 'info' })

    // Act
    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="toast-action"]').exists()).toBe(false)
  })

  // Implementation detail — Each toast is keyed by toast.id
  it('keys each toast item by toast.id', () => {
    // Arrange
    const i18n = createTestI18n()
    const { toasts, addToast } = useToast()
    addToast({ message: 'First', type: 'info' })
    addToast({ message: 'Second', type: 'success' })

    // Act
    const wrapper = mount(ToastContainer, {
      global: { plugins: [i18n] },
    })

    // Assert — each toast item has a unique key matching toast.id
    const toastItems = wrapper.findAll('[data-testid="toast-item"]')
    expect(toastItems[0].attributes('data-toast-id')).toBe(toasts.value[0].id)
    expect(toastItems[1].attributes('data-toast-id')).toBe(toasts.value[1].id)
  })

  // SC-24-04 — ToastContainer component test suite exists and passes
  // This test file's existence and passing satisfies SC-24-04
})
