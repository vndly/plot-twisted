import { describe, it, expect } from 'vitest'
import { ListSchema } from '@/domain/library.schema'

describe('ListSchema', () => {
  it('validates a correct list object', () => {
    // Arrange
    const list = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Sci-Fi Classics',
      createdAt: '2026-04-05T12:00:00Z',
    }

    // Act
    const result = ListSchema.safeParse(list)

    // Assert
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(list)
    }
  })

  it('fails with an empty name', () => {
    // Arrange
    const list = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: '',
      createdAt: '2026-04-05T12:00:00Z',
    }

    // Act
    const result = ListSchema.safeParse(list)

    // Assert
    expect(result.success).toBe(false)
  })

  it('fails with an invalid UUID for id', () => {
    // Arrange
    const list = {
      id: 'not-a-uuid',
      name: 'Horror',
      createdAt: '2026-04-05T12:00:00Z',
    }

    // Act
    const result = ListSchema.safeParse(list)

    // Assert
    expect(result.success).toBe(false)
  })

  it('fails with an invalid ISO date for createdAt', () => {
    // Arrange
    const list = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Horror',
      createdAt: 'invalid-date',
    }

    // Act
    const result = ListSchema.safeParse(list)

    // Assert
    expect(result.success).toBe(false)
  })
})
