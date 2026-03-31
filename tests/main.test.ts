import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type AppErrorHandler = (error: unknown, instance: unknown, info: string) => void

interface MockApp {
  config: {
    errorHandler?: AppErrorHandler
  }
  use: (plugin: unknown) => MockApp
  mount: (selector: string) => void
}

let toastModule: typeof import('@/presentation/composables/use-toast')

describe('main', () => {
  beforeEach(async () => {
    vi.resetModules()
    vi.restoreAllMocks()

    toastModule = await import('@/presentation/composables/use-toast')
    toastModule._resetForTesting()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // SC-19-01
  it('registers a global error handler that logs errors and dispatches an error toast', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const i18nMock = {
      global: {
        t: vi.fn((key: string) => (key === 'toast.error' ? 'An error occurred' : key)),
      },
    }
    const routerMock = { name: 'router' }
    let capturedApp: MockApp | undefined

    vi.doMock('vue', async () => {
      const actual = await vi.importActual<typeof import('vue')>('vue')

      return {
        ...actual,
        createApp: vi.fn(() => {
          const app: MockApp = {
            config: {},
            use: vi.fn(() => app),
            mount: vi.fn(),
          }
          capturedApp = app
          return app
        }),
      }
    })

    vi.doMock('@/App.vue', () => ({ default: {} }))
    vi.doMock('@/presentation/i18n', () => ({ default: i18nMock }))
    vi.doMock('@/presentation/router', () => ({ default: routerMock }))

    // Act
    await import('@/main')

    // Assert
    expect(capturedApp?.config.errorHandler).toBeTypeOf('function')

    const errorHandler = capturedApp?.config.errorHandler
    if (!errorHandler) {
      throw new Error('Expected main.ts to register app.config.errorHandler')
    }

    const error = new Error('Unhandled render failure')
    errorHandler(error, null, 'render')

    const { toasts } = toastModule.useToast()

    expect(consoleSpy).toHaveBeenCalledWith(error)
    expect(i18nMock.global.t).toHaveBeenCalledWith('toast.error')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]).toMatchObject({
      message: 'An error occurred',
      type: 'error',
    })
  })
})
