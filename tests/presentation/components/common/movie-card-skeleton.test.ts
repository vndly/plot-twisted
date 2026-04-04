import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MovieCardSkeleton from '@/presentation/components/common/movie-card-skeleton.vue'

describe('MovieCardSkeleton', () => {
  it('renders with 2:3 aspect ratio', () => {
    // Arrange
    const wrapper = mount(MovieCardSkeleton)

    // Assert
    const posterSkeleton = wrapper.find('[data-testid="poster-skeleton"]')
    expect(posterSkeleton.exists()).toBe(true)
    expect(posterSkeleton.classes()).toContain('aspect-[2/3]')
  })

  it('has shimmer animation class', () => {
    // Arrange
    const wrapper = mount(MovieCardSkeleton)

    // Assert
    const posterSkeleton = wrapper.find('[data-testid="poster-skeleton"]')
    expect(posterSkeleton.classes()).toContain('animate-pulse')
  })

  it('can be rendered multiple times for loading grid (HS-07-09)', () => {
    // Arrange - render 8 skeletons
    const skeletons = Array.from({ length: 8 }, () => mount(MovieCardSkeleton))

    // Assert
    expect(skeletons).toHaveLength(8)
    skeletons.forEach((wrapper) => {
      expect(wrapper.find('[data-testid="poster-skeleton"]').exists()).toBe(true)
    })
  })

  it('includes text line placeholders for title and year', () => {
    // Arrange
    const wrapper = mount(MovieCardSkeleton)

    // Assert
    expect(wrapper.find('[data-testid="title-skeleton"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="year-skeleton"]').exists()).toBe(true)
  })
})
