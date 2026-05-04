import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useLibrarySearch } from '@/application/use-library-search'

describe('useLibrarySearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with empty query', () => {
    const { query, appliedQuery, hasSearchQuery } = useLibrarySearch()
    expect(query.value).toBe('')
    expect(appliedQuery.value).toBe('')
    expect(hasSearchQuery.value).toBe(false)
  })

  it('applies query after 300ms debounce (LBS-02-01)', async () => {
    const { query, appliedQuery } = useLibrarySearch()
    query.value = 'batman'
    await nextTick()

    expect(appliedQuery.value).toBe('')

    await vi.advanceTimersByTimeAsync(300)
    expect(appliedQuery.value).toBe('batman')
  })

  it('resets debounce timer on continued typing', async () => {
    const { query, appliedQuery } = useLibrarySearch()
    query.value = 'bat'
    await nextTick()
    await vi.advanceTimersByTimeAsync(200)

    query.value = 'batman'
    await nextTick()
    await vi.advanceTimersByTimeAsync(200)

    expect(appliedQuery.value).toBe('')

    await vi.advanceTimersByTimeAsync(100)
    expect(appliedQuery.value).toBe('batman')
  })

  it('clears query immediately (LBS-06-02)', async () => {
    const { query, appliedQuery, clearSearch } = useLibrarySearch()
    query.value = 'batman'
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)
    expect(appliedQuery.value).toBe('batman')

    clearSearch()
    await nextTick()
    expect(query.value).toBe('')
    expect(appliedQuery.value).toBe('')
  })

  it('cancels pending debounce on clear', async () => {
    const { query, appliedQuery, clearSearch } = useLibrarySearch()
    query.value = 'batman'
    await nextTick()
    await vi.advanceTimersByTimeAsync(100)

    clearSearch()
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)

    expect(appliedQuery.value).toBe('')
  })

  it('hasSearchQuery is true when query is not empty', async () => {
    const { query, hasSearchQuery } = useLibrarySearch()
    expect(hasSearchQuery.value).toBe(false)

    query.value = 'a'
    await nextTick()
    expect(hasSearchQuery.value).toBe(true)

    query.value = '  '
    await nextTick()
    expect(hasSearchQuery.value).toBe(false)
  })

  it('clears pending debounce timeout on unmount', async () => {
    const { createApp, defineComponent, h } = await import('vue')

    const holder: { result: ReturnType<typeof useLibrarySearch> | null } = { result: null }

    const TestComponent = defineComponent({
      setup() {
        holder.result = useLibrarySearch()
        return () => h('div')
      },
    })

    const app = createApp(TestComponent)
    const container = document.createElement('div')
    app.mount(container)

    // Set a query to trigger debounce timeout
    expect(holder.result).not.toBeNull()
    const result = holder.result as ReturnType<typeof useLibrarySearch>
    result.query.value = 'test'
    await nextTick()

    // Unmount before debounce completes
    app.unmount()

    // Advance timers - should not cause any errors
    await vi.advanceTimersByTimeAsync(500)

    // The appliedQuery should still be empty since unmount cleared the timeout
    expect(result.appliedQuery.value).toBe('')
  })

  it('does nothing when onUnmounted is called without an active debounce', async () => {
    const { createApp, defineComponent, h } = await import('vue')

    const holder: { result: ReturnType<typeof useLibrarySearch> | null } = { result: null }

    const TestComponent = defineComponent({
      setup() {
        holder.result = useLibrarySearch()
        return () => h('div')
      },
    })

    const app = createApp(TestComponent)
    const container = document.createElement('div')
    app.mount(container)

    expect(holder.result).not.toBeNull()

    // Unmount immediately without setting a query (no debounce timeout active)
    app.unmount()

    // Should not throw - the if (debounceTimeout) check handles null
    expect(true).toBe(true)
  })

  it('does nothing when clearSearch is called without an active debounce', () => {
    const { clearSearch, appliedQuery } = useLibrarySearch()

    // Call clearSearch immediately without any query set (no timeout active)
    clearSearch()

    expect(appliedQuery.value).toBe('')
  })
})
