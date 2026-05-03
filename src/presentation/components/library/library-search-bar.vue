<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()

const { t } = useI18n()
const searchInput = useTemplateRef<HTMLInputElement>('searchInput')

/** Whether the clear button should be visible. */
const showClear = computed(() => props.modelValue.length > 0)

/**
 * Handles input changes and emits the new value.
 */
function handleInput(event: Event) {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', input.value)
}

/**
 * Emits clear intent and returns focus to input.
 */
function handleClear() {
  emit('clear')
  searchInput.value?.focus()
}

/**
 * Handles escape key to clear search.
 */
function handleEscape() {
  emit('clear')
}
</script>

<template>
  <div class="relative w-full">
    <!-- Search icon -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400"
      data-testid="search-icon"
    >
      <Search class="size-5" aria-hidden="true" />
    </div>

    <!-- Search input -->
    <input
      ref="searchInput"
      type="search"
      :value="modelValue"
      :placeholder="t('library.search.placeholder')"
      maxlength="120"
      class="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-slate-950 shadow-sm placeholder-slate-500 outline-none ring-accent focus:ring-2 dark:border-transparent dark:bg-surface dark:text-white dark:shadow-none dark:placeholder-slate-400 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
      @input="handleInput"
      @keydown.enter.prevent
      @keydown.escape.prevent="handleEscape"
    />

    <!-- Clear button -->
    <button
      v-if="showClear"
      type="button"
      :aria-label="t('library.search.clear')"
      class="absolute inset-y-0 right-0 flex size-11 items-center justify-center text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
      @click="handleClear"
    >
      <X class="size-5" aria-hidden="true" />
    </button>
  </div>
</template>
