import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PersonSkeleton from '@/presentation/components/details/person-skeleton.vue'

describe('PersonSkeleton', () => {
  it('renders skeleton container with test id', () => {
    const wrapper = mount(PersonSkeleton)

    expect(wrapper.find('[data-testid="person-skeleton"]').exists()).toBe(true)
  })

  it('renders animated pulse elements for profile, name, and department placeholders', () => {
    const wrapper = mount(PersonSkeleton)

    const pulseElements = wrapper.findAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThan(0)
  })

  it('renders 12 filmography skeleton cards', () => {
    const wrapper = mount(PersonSkeleton)

    // Each filmography card has 3 animated elements (poster, title, year)
    // The grid should have 12 items for the filmography skeleton
    const grid = wrapper.findAll('.grid > div')
    expect(grid).toHaveLength(12)
  })

  it('has motion-reduce class to respect user preferences', () => {
    const wrapper = mount(PersonSkeleton)

    const container = wrapper.find('[data-testid="person-skeleton"]')
    expect(container.classes()).toContain('motion-reduce:[&_*]:animate-none')
  })

  it('renders profile image placeholder with correct responsive sizing', () => {
    const wrapper = mount(PersonSkeleton)

    const profilePlaceholder = wrapper.find('.rounded-full')
    expect(profilePlaceholder.exists()).toBe(true)
    expect(profilePlaceholder.classes()).toContain('size-40')
    expect(profilePlaceholder.classes()).toContain('md:size-[200px]')
  })
})
