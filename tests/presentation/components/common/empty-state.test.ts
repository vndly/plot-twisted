import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '@/presentation/components/common/empty-state.vue'

describe('EmptyState', () => {
  // SC-16-01, SC-24-01 — Renders icon, title, and description when all provided
  it('renders icon, title, and description when all provided', () => {
    // Arrange
    const IconComponent = { template: '<svg data-testid="icon"></svg>' }

    // Act
    const wrapper = mount(EmptyState, {
      props: {
        icon: IconComponent,
        title: 'No results found',
        description: 'Try adjusting your search.',
      },
    })

    // Assert
    expect(wrapper.findComponent(IconComponent).exists()).toBe(true)
    expect(wrapper.text()).toContain('No results found')
    expect(wrapper.text()).toContain('Try adjusting your search.')
  })

  // SC-16-02, SC-24-01 — With only title prop, icon and description are absent
  it('renders only title when optional props are omitted', () => {
    // Arrange & Act
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Nothing here yet',
      },
    })

    // Assert
    expect(wrapper.text()).toContain('Nothing here yet')
    expect(wrapper.find('[data-testid="empty-state-icon"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="empty-state-description"]').exists()).toBe(false)
  })

  // SC-16-03, SC-24-01 — CTA button renders when ctaLabel and ctaAction are provided
  it('renders CTA button when ctaLabel and ctaAction are provided', () => {
    // Arrange
    const ctaAction = vi.fn()

    // Act
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Empty',
        ctaLabel: 'Try Again',
        ctaAction,
      },
    })

    // Assert
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Try Again')
  })

  // SC-16-04 — No CTA button rendered when ctaLabel is provided without ctaAction
  it('does not render CTA button when ctaLabel is provided without ctaAction', () => {
    // Arrange & Act
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Empty',
        ctaLabel: 'Try Again',
      },
    })

    // Assert
    expect(wrapper.find('button').exists()).toBe(false)
  })

  // SC-16-05, SC-24-01 — CTA button click invokes ctaAction handler
  it('invokes ctaAction handler when CTA button is clicked', async () => {
    // Arrange
    const ctaAction = vi.fn()
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Empty',
        ctaLabel: 'Try Again',
        ctaAction,
      },
    })

    // Act
    await wrapper.find('button').trigger('click')

    // Assert
    expect(ctaAction).toHaveBeenCalledOnce()
  })

  // SC-16-06 — Empty title string renders without error
  it('renders without error when title is an empty string', () => {
    // Arrange & Act
    const wrapper = mount(EmptyState, {
      props: {
        title: '',
      },
    })

    // Assert
    expect(wrapper.exists()).toBe(true)
  })

  // Implementation detail — No CTA button rendered when ctaAction is provided without ctaLabel
  it('does not render CTA button when ctaAction is provided without ctaLabel', () => {
    // Arrange & Act
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Empty',
        ctaAction: vi.fn(),
      },
    })

    // Assert
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
