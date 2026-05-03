import { describe, it, expect } from 'vitest'
import { LibrarySearchQuerySchema } from '@/domain/library-search.schema'

describe('LibrarySearchQuerySchema', () => {
  it('trims leading and trailing whitespace', () => {
    const result = LibrarySearchQuerySchema.parse('  batman  ')
    expect(result).toBe('batman')
  })

  it('truncates to 120 characters after trimming', () => {
    const longString = 'a'.repeat(150)
    const result = LibrarySearchQuerySchema.parse(`  ${longString}  `)
    expect(result).toBe('a'.repeat(120))
    expect(result.length).toBe(120)
  })

  it('converts to lowercase', () => {
    const result = LibrarySearchQuerySchema.parse('BaTmAn')
    expect(result).toBe('batman')
  })

  it('treats whitespace-only queries as empty strings', () => {
    const result = LibrarySearchQuerySchema.parse('   ')
    expect(result).toBe('')
  })

  it('preserves internal whitespace literally', () => {
    const result = LibrarySearchQuerySchema.parse('star  wars')
    expect(result).toBe('star  wars')
  })

  it('preserves special characters literally', () => {
    const result = LibrarySearchQuerySchema.parse('.*+?^${}()|[]')
    expect(result).toBe('.*+?^${}()|[]')
  })

  it('handles null or undefined by returning empty string (if allowed by schema)', () => {
    // Depending on implementation, we might want it to handle non-string inputs or just fail.
    // The plan says "Zod parsing", usually it parses a string input.
    const result = LibrarySearchQuerySchema.parse(undefined)
    expect(result).toBe('')
  })
})
