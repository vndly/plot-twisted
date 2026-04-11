<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, Check } from 'lucide-vue-next'
import { SortField, SortOrder } from '@/domain/filter.schema'

const props = defineProps<{
  modelValue: SortField
  order: SortOrder
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: SortField): void
  (e: 'update:order', value: SortOrder): void
}>()

const { t } = useI18n()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const sortFields: SortField[] = ['dateAdded', 'title', 'releaseYear', 'userRating']

/**
 * Handles field selection.
 */
function selectField(field: SortField) {
  emit('update:modelValue', field)
  isOpen.value = false
}

/**
 * Toggles sort order.
 */
function toggleOrder() {
  emit('update:order', props.order === 'asc' ? 'desc' : 'asc')
}

/**
 * Closes the dropdown if clicking outside.
 */
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as globalThis.Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

/**
 * Gets localized label for the current order of a field.
 */
function getOrderLabel(field: SortField, order: SortOrder) {
  return t(`library.sort.order.${field}.${order}`)
}
</script>

<template>
  <div ref="dropdownRef" class="flex items-center gap-2">
    <div class="relative">
      <button
        type="button"
        class="flex items-center gap-2 rounded-lg bg-surface px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-surface-hover"
        @click="isOpen = !isOpen"
      >
        <span class="text-slate-400">{{ t('library.sort.label') }}:</span>
        <span>{{ t(`library.sort.${modelValue}`) }}</span>
        <ChevronDown class="size-4 text-slate-400" />
      </button>

      <div
        v-if="isOpen"
        class="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-slate-700 bg-surface p-1 shadow-xl"
      >
        <button
          v-for="field in sortFields"
          :key="field"
          type="button"
          class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-700"
          :class="{ 'text-accent': modelValue === field, 'text-white': modelValue !== field }"
          @click="selectField(field)"
        >
          <span>{{ t(`library.sort.${field}`) }}</span>
          <Check v-if="modelValue === field" class="size-4" />
        </button>
      </div>
    </div>

    <button
      type="button"
      class="rounded-lg bg-surface px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-surface-hover"
      @click="toggleOrder"
    >
      {{ getOrderLabel(modelValue, order) }}
    </button>
  </div>
</template>
