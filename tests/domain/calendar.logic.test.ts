import { describe, it, expect } from 'vitest'
import { getMonthDays, getCalendarDays, groupMoviesByDate } from '@/domain/calendar.logic'
import type { MovieListItem } from '@/domain/movie.schema'

describe('calendar logic', () => {
  describe('getMonthDays', () => {
    it('returns correct number of days for February in a non-leap year (FR-06-01-02)', () => {
      const days = getMonthDays(2023, 1) // 0-indexed month: 1 is February
      expect(days).toHaveLength(28)
      expect(days[0].getDate()).toBe(1)
      expect(days[27].getDate()).toBe(28)
    })

    it('returns correct number of days for February in a leap year (FR-06-01-03)', () => {
      const days = getMonthDays(2024, 1) // 2024 is a leap year
      expect(days).toHaveLength(29)
    })

    it('returns correct number of days for a 31-day month', () => {
      const days = getMonthDays(2026, 2) // March
      expect(days).toHaveLength(31)
    })
  })

  describe('getCalendarDays', () => {
    it('returns full calendar grid days including padding from previous/next months (FR-06-01-01)', () => {
      // April 2026 starts on Wednesday (day 3 if Sunday is 0)
      // We want to see how many days are returned to fill a 7-column grid
      const days = getCalendarDays(2026, 3) // April

      // April 2026:
      // Starts on Wed (3)
      // Needs 3 padding days from March (Sun, Mon, Tue)
      // April has 30 days
      // 3 + 30 = 33 days so far
      // Needs padding to reach multiple of 7 (35 or 42)
      // 35 - 33 = 2 padding days from May

      expect(days.length % 7).toBe(0)
      expect(days.length).toBeGreaterThanOrEqual(35)

      // Check first day is March 29 (Sunday)
      expect(days[0].getFullYear()).toBe(2026)
      expect(days[0].getMonth()).toBe(2) // March
      expect(days[0].getDate()).toBe(29)
    })
  })

  describe('groupMoviesByDate', () => {
    it('groups movies correctly by their release date (FR-06-02-01)', () => {
      const movies = [
        { id: 1, title: 'Movie 1', release_date: '2026-04-15' },
        { id: 2, title: 'Movie 2', release_date: '2026-04-15' },
        { id: 3, title: 'Movie 3', release_date: '2026-04-16' },
        { id: 4, title: 'Movie 4', release_date: '' }, // No date
      ] as MovieListItem[]

      const grouped = groupMoviesByDate(movies)

      expect(grouped['2026-04-15']).toHaveLength(2)
      expect(grouped['2026-04-15'][0].id).toBe(1)
      expect(grouped['2026-04-15'][1].id).toBe(2)
      expect(grouped['2026-04-16']).toHaveLength(1)
      expect(grouped['2026-04-16'][0].id).toBe(3)
      expect(grouped['']).toBeUndefined() // Empty dates should be ignored or handled separately
    })
  })
})
