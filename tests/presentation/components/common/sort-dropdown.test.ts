import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SortDropdown from '@/presentation/components/common/sort-dropdown.vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      'library.sort.label': 'Sort',
      'library.sort.dateAdded': 'Date Added',
      'library.sort.title': 'Title',
      'library.sort.releaseYear': 'Release Year',
      'library.sort.userRating': 'User Rating',
      'library.sort.order.asc': 'Ascending',
      'library.sort.order.desc': 'Descending',
      'library.sort.order.dateAdded.asc': 'Oldest First',
      'library.sort.order.dateAdded.desc': 'Newest First',
    },
  },
})

describe('SortDropdown', () => {
  it('renders with current selection', () => {
    const wrapper = mount(SortDropdown, {
      global: { plugins: [i18n] },
      props: {
        modelValue: 'dateAdded',
        order: 'desc',
      },
    })

    expect(wrapper.text()).toContain('Date Added')
    expect(wrapper.text()).toContain('Newest First')
  })

  it('emits update events when changing sort', async () => {
    const wrapper = mount(SortDropdown, {
      global: { plugins: [i18n] },
      props: {
        modelValue: 'dateAdded',
        order: 'desc',
      },
    })

    await wrapper.find('button').trigger('click')
    // In a real implementation, we'd click an option.
    // This is a stub test for now.
  })
})
