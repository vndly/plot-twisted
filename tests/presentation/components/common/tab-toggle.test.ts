import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TabToggle from '@/presentation/components/common/tab-toggle.vue'

describe('TabToggle', () => {
  const tabs = [
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' },
  ]

  it('renders all tabs provided in props', () => {
    // Act
    const wrapper = mount(TabToggle, {
      props: {
        tabs,
        activeTab: 'tab1',
      },
    })

    // Assert
    const tabButtons = wrapper.findAll('button')
    expect(tabButtons).toHaveLength(2)
    expect(tabButtons[0].text()).toBe('Tab 1')
    expect(tabButtons[1].text()).toBe('Tab 2')
  })

  it('highlights the active tab', () => {
    // Act
    const wrapper = mount(TabToggle, {
      props: {
        tabs,
        activeTab: 'tab2',
      },
    })

    // Assert
    const tabButtons = wrapper.findAll('button')
    // We expect some class to indicate active state, usually defined by Tailwind
    expect(tabButtons[1].classes()).toContain('bg-accent') // Assuming bg-accent for active
  })

  it('emits update:activeTab event when a tab is clicked', async () => {
    // Arrange
    const wrapper = mount(TabToggle, {
      props: {
        tabs,
        activeTab: 'tab1',
      },
    })

    // Act
    await wrapper.findAll('button')[1].trigger('click')

    // Assert
    expect(wrapper.emitted('update:activeTab')).toBeTruthy()
    expect(wrapper.emitted('update:activeTab')?.[0]).toEqual(['tab2'])
  })
})
