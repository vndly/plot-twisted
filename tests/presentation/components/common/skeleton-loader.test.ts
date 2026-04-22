import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkeletonLoader from '@/presentation/components/common/skeleton-loader.vue'

describe('SkeletonLoader', () => {
  // SC-17-01, SC-24-02 — Renders with specified dimensions, pulsing shimmer, and aria-hidden
  it('renders with specified dimensions, pulse animation, and aria-hidden', () => {
    // Arrange & Act
    const wrapper = mount(SkeletonLoader, {
      props: {
        width: '200px',
        height: '2rem',
      },
    })

    // Assert
    const div = wrapper.find('div')
    expect(div.attributes('aria-hidden')).toBe('true')
    expect(div.classes()).toContain('animate-pulse')
    expect(div.classes()).toContain('bg-slate-200')
    expect(div.classes()).toContain('dark:bg-surface')
    expect(div.attributes('style')).toContain('width: 200px')
    expect(div.attributes('style')).toContain('height: 2rem')
  })

  // SC-17-02, SC-24-02 — Applies custom rounded prop
  it('applies custom rounded prop', () => {
    // Arrange & Act
    const wrapper = mount(SkeletonLoader, {
      props: {
        rounded: 'rounded-full',
      },
    })

    // Assert
    const div = wrapper.find('div')
    expect(div.classes()).toContain('rounded-full')
    expect(div.classes()).not.toContain('rounded-md')
  })

  // SC-17-03, SC-24-02 — Renders with default prop values
  it('renders with default prop values', () => {
    // Arrange & Act
    const wrapper = mount(SkeletonLoader)

    // Assert
    const div = wrapper.find('div')
    expect(div.attributes('style')).toContain('width: 100%')
    expect(div.attributes('style')).toContain('height: 1rem')
    expect(div.classes()).toContain('rounded-md')
    expect(div.classes()).toContain('animate-pulse')
    expect(div.classes()).toContain('bg-slate-200')
    expect(div.classes()).toContain('dark:bg-surface')
    expect(div.attributes('aria-hidden')).toBe('true')
  })
})
