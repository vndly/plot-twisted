<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  options: { value: string; label: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const currentLabel = computed(() => {
  return props.options.find((o) => o.value === props.modelValue)?.label || props.modelValue
})

/**
 * Handles clicks outside the dropdown to close it.
 * @param event - The click event
 */
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as globalThis.Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

/**
 * Selects an option and closes the dropdown.
 * @param value - The value to select
 */
function selectOption(value: string) {
  emit('update:modelValue', value)
  isOpen.value = false
}
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      type="button"
      class="flex min-w-[120px] items-center justify-between gap-2 rounded-lg bg-surface px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
      @click="isOpen = !isOpen"
    >
      <span>{{ currentLabel }}</span>
      <ChevronDown class="size-4 text-slate-400" />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 z-50 mt-2 w-full min-w-[160px] rounded-lg border border-slate-700 bg-surface p-1 shadow-xl"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-700"
        :class="{
          'text-accent': modelValue === option.value,
          'text-white': modelValue !== option.value,
        }"
        @click="selectOption(option.value)"
      >
        <span>{{ option.label }}</span>
        <Check v-if="modelValue === option.value" class="size-4" />
      </button>
    </div>
  </div>
</template>
