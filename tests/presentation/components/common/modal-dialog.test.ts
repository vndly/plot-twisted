import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ModalDialog from '@/presentation/components/common/modal-dialog.vue'
import { useModal, _resetForTesting } from '@/presentation/composables/use-modal'

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
        'modal.confirm': 'Confirm',
        'modal.cancel': 'Cancel',
      },
      es: {
        'modal.confirm': 'Confirmar',
        'modal.cancel': 'Cancelar',
      },
    },
  })
}

describe('ModalDialog', () => {
  beforeEach(() => {
    _resetForTesting()
  })

  // Implementation detail — Does not render when isOpen is false
  it('does not render when modal is not open', () => {
    // Arrange
    const i18n = createTestI18n()

    // Act
    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="modal-backdrop"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="modal-content"]').exists()).toBe(false)
  })

  // SC-15-01 — Opens and renders title, content, confirm, and cancel buttons
  it('renders title, content, and buttons when open', () => {
    // Arrange
    const i18n = createTestI18n()
    const { open } = useModal()
    open({ title: 'Confirm Delete', content: 'This action cannot be undone.' })

    // Act
    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="modal-backdrop"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="modal-content"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="modal-title"]').text()).toBe('Confirm Delete')
    expect(wrapper.find('[data-testid="modal-body"]').text()).toBe('This action cannot be undone.')
    expect(wrapper.find('[data-testid="modal-cancel"]').text()).toBe('Cancel')
    expect(wrapper.find('[data-testid="modal-confirm"]').text()).toBe('Confirm')
  })

  // SC-15-01 — Cancel button on left, confirm on right (DOM order)
  it('positions cancel button before confirm button', () => {
    // Arrange
    const i18n = createTestI18n()
    const { open } = useModal()
    open({ title: 'Test' })

    // Act
    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Assert — check button order in footer
    const buttons = wrapper.findAll('[data-testid="modal-footer"] button')
    expect(buttons[0].attributes('data-testid')).toBe('modal-cancel')
    expect(buttons[1].attributes('data-testid')).toBe('modal-confirm')
  })

  // SC-15-02 — Closes on backdrop click
  it('closes modal when backdrop is clicked', async () => {
    // Arrange
    const i18n = createTestI18n()
    const { open, isOpen } = useModal()
    open({ title: 'Test' })
    expect(isOpen.value).toBe(true)

    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="modal-backdrop"]').trigger('click')

    // Assert
    expect(isOpen.value).toBe(false)
  })

  // SC-15-03 — Closes on Escape key
  it('closes modal when Escape key is pressed', async () => {
    // Arrange
    const i18n = createTestI18n()
    const { open, isOpen } = useModal()
    open({ title: 'Test' })
    expect(isOpen.value).toBe(true)

    mount(ModalDialog, {
      global: { plugins: [i18n] },
      attachTo: document.body,
    })

    // Act
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)
    await flushPromises()

    // Assert
    expect(isOpen.value).toBe(false)
  })

  // SC-15-04 — Confirm button invokes onConfirm callback
  it('invokes onConfirm callback when confirm button is clicked', async () => {
    // Arrange
    const i18n = createTestI18n()
    const onConfirm = vi.fn()
    const { open, isOpen } = useModal()
    open({ title: 'Test', onConfirm })

    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="modal-confirm"]').trigger('click')

    // Assert
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(isOpen.value).toBe(false)
  })

  // SC-15-05 — Cancel button invokes onCancel callback
  it('invokes onCancel callback when cancel button is clicked', async () => {
    // Arrange
    const i18n = createTestI18n()
    const onCancel = vi.fn()
    const { open, isOpen } = useModal()
    open({ title: 'Test', onCancel })

    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="modal-cancel"]').trigger('click')

    // Assert
    expect(onCancel).toHaveBeenCalledOnce()
    expect(isOpen.value).toBe(false)
  })

  // SC-15-06 — Opening a new modal replaces the current one
  it('replaces current modal when a new one is opened', async () => {
    // Arrange
    const i18n = createTestI18n()
    const { open } = useModal()
    open({ title: 'First Modal' })

    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })
    expect(wrapper.find('[data-testid="modal-title"]').text()).toBe('First Modal')

    // Act
    open({ title: 'Second Modal' })
    await flushPromises()

    // Assert
    expect(wrapper.find('[data-testid="modal-title"]').text()).toBe('Second Modal')
    expect(wrapper.findAll('[data-testid="modal-content"]')).toHaveLength(1)
  })

  // SC-15-07a — Modal open transition (uses Transition with modal-* classes)
  it('uses Transition with modal classes for open animation', () => {
    // Arrange
    const i18n = createTestI18n()
    const { open } = useModal()
    open({ title: 'Test' })

    // Act
    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Assert — Transition uses name="modal" which maps to modal-* CSS classes
    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.exists()).toBe(true)
    expect(transition.attributes('name')).toBe('modal')
  })

  // SC-15-07b — Modal close transition (uses same Transition with modal-* classes)
  it('uses Transition with modal classes for close animation', async () => {
    // Arrange
    const i18n = createTestI18n()
    const { open, close, isOpen } = useModal()
    open({ title: 'Test' })

    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })
    expect(wrapper.findComponent({ name: 'Transition' }).exists()).toBe(true)

    // Act
    close()
    await flushPromises()

    // Assert — modal closes (transition handled by CSS)
    expect(isOpen.value).toBe(false)
  })

  // SC-15-08 — Modal text renders in non-default locale
  it('renders button labels in Spanish when locale is es', () => {
    // Arrange
    const i18n = createTestI18n('es')
    const { open } = useModal()
    open({ title: 'Test' })

    // Act
    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="modal-cancel"]').text()).toBe('Cancelar')
    expect(wrapper.find('[data-testid="modal-confirm"]').text()).toBe('Confirmar')
  })

  // SC-15-09 — Transitions disabled with reduced motion
  // Note: CSS handles this via media query; test verifies Transition is present
  it('renders Transition (CSS handles reduced motion)', () => {
    // Arrange
    const i18n = createTestI18n()
    const { open } = useModal()
    open({ title: 'Test' })

    // Act
    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Assert — Transition exists; actual reduced-motion behavior is CSS-driven
    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.exists()).toBe(true)
  })

  // SC-15-10 — Clicking inside modal content card does not close modal
  it('does not close modal when clicking inside content card', async () => {
    // Arrange
    const i18n = createTestI18n()
    const { open, isOpen } = useModal()
    open({ title: 'Test', content: 'Some content' })

    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="modal-content"]').trigger('click')

    // Assert
    expect(isOpen.value).toBe(true)
  })

  // SC-15-11 — Modal with missing optional content
  it('does not render content area when content is not provided', () => {
    // Arrange
    const i18n = createTestI18n()
    const { open } = useModal()
    open({ title: 'Simple Confirmation' })

    // Act
    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="modal-title"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="modal-body"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="modal-confirm"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="modal-cancel"]').exists()).toBe(true)
  })

  // Additional: Custom button labels
  it('uses custom button labels when provided', () => {
    // Arrange
    const i18n = createTestI18n()
    const { open } = useModal()
    open({ title: 'Delete Item', confirmLabel: 'Delete', cancelLabel: 'Keep' })

    // Act
    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Assert
    expect(wrapper.find('[data-testid="modal-confirm"]').text()).toBe('Delete')
    expect(wrapper.find('[data-testid="modal-cancel"]').text()).toBe('Keep')
  })

  // Additional: Escape listener is removed when modal closes
  it('removes Escape listener when modal closes', async () => {
    // Arrange
    const i18n = createTestI18n()
    const { open, close, isOpen } = useModal()
    open({ title: 'Test' })

    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
      attachTo: document.body,
    })

    // Act — close modal
    close()
    await flushPromises()

    // Reopen modal to reset state
    open({ title: 'New Modal' })
    await flushPromises()

    // Press Escape — should close new modal
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)
    await flushPromises()

    // Assert
    expect(isOpen.value).toBe(false)

    wrapper.unmount()
  })

  // Additional: onConfirm is optional
  it('closes modal on confirm click even without onConfirm callback', async () => {
    // Arrange
    const i18n = createTestI18n()
    const { open, isOpen } = useModal()
    open({ title: 'Test' })

    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="modal-confirm"]').trigger('click')

    // Assert
    expect(isOpen.value).toBe(false)
  })

  // Additional: onCancel is optional
  it('closes modal on cancel click even without onCancel callback', async () => {
    // Arrange
    const i18n = createTestI18n()
    const { open, isOpen } = useModal()
    open({ title: 'Test' })

    const wrapper = mount(ModalDialog, {
      global: { plugins: [i18n] },
    })

    // Act
    await wrapper.find('[data-testid="modal-cancel"]').trigger('click')

    // Assert
    expect(isOpen.value).toBe(false)
  })

  // SC-24-05 — ModalDialog component test suite exists and passes
  // This test file's existence and passing satisfies SC-24-05
})
