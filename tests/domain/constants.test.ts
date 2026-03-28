import { describe, it, expect } from 'vitest'
import { TOAST_DISMISS_MS } from '@/domain/constants'

describe('domain constants', () => {
  it('exports TOAST_DISMISS_MS with value 4000', () => {
    expect(TOAST_DISMISS_MS).toBe(4000)
  })

  it('TOAST_DISMISS_MS is a number', () => {
    expect(typeof TOAST_DISMISS_MS).toBe('number')
  })
})
