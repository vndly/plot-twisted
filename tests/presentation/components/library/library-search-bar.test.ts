import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import LibrarySearchBar from '@/presentation/components/library/library-search-bar.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      'library.search.placeholder': 'Search titles, tags, notes...',
      'library.search.clear': 'Clear search',
    },
  },
})

describe('LibrarySearchBar', () => {
  const mountComponent = (props = {}) => {
    return mount(LibrarySearchBar, {
      props: {
        modelValue: '',
        ...props,
      },
      global: {
        plugins: [i18n],
      },
      attachTo: document.body,
    })
  }

  it('updates v-model on input (LBS-01-01)', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('input')
    await input.setValue('batman')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['batman'])
  })

  it('has correct placeholder (LBS-01-01)', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search titles, tags, notes...')
  })

  it('has maxlength="120" (LBS-05-01)', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('input').attributes('maxlength')).toBe('120')
  })

  it('shows clear button only when non-empty (LBS-06-01)', async () => {
    const wrapper = mountComponent({ modelValue: '' })
    expect(wrapper.find('[aria-label="Clear search"]').exists()).toBe(false)

    await wrapper.setProps({ modelValue: 'test' })
    expect(wrapper.find('[aria-label="Clear search"]').exists()).toBe(true)
  })

  it('emits clear when clear button is clicked (LBS-06-01)', async () => {
    const wrapper = mountComponent({ modelValue: 'test' })
    const clearButton = wrapper.find('[aria-label="Clear search"]')
    await clearButton.trigger('click')
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('prevents enter key from submitting form (LBS-10-01)', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('input')

    // We can check if the event is prevented by passing a mock event
    const preventDefault = vi.fn()
    await input.trigger('keydown.enter', {
      preventDefault,
    })
    expect(preventDefault).toHaveBeenCalled()
  })

  it('emits clear on escape key (LBS-10-01)', async () => {
    const wrapper = mountComponent({ modelValue: 'test' })
    const input = wrapper.find('input')
    await input.trigger('keydown.escape')
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('returns focus to input after clear button click (LBS-06-02)', async () => {
    const wrapper = mountComponent({ modelValue: 'test' })
    const clearButton = wrapper.find('[aria-label="Clear search"]')
    const input = wrapper.find('input').element

    await clearButton.trigger('click')
    expect(document.activeElement).toBe(input)
  })
})
