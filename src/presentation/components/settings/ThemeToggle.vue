<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: 'light' | 'dark'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'light' | 'dark'): void
}>()

/**
 * Toggles between light and dark themes.
 */
function toggle() {
  emit('update:modelValue', props.modelValue === 'light' ? 'dark' : 'light')
}
</script>

<template>
  <button
    type="button"
    class="relative flex h-8 w-14 cursor-pointer items-center rounded-full transition-colors duration-200"
    :class="modelValue === 'dark' ? 'bg-slate-700' : 'bg-slate-300'"
    @click="toggle"
  >
    <div
      class="absolute left-1 flex size-6 transform items-center justify-center rounded-full bg-white transition-transform duration-200"
      :class="modelValue === 'dark' ? 'translate-x-6 text-slate-900' : 'text-amber-500'"
    >
      <Sun v-if="modelValue === 'light'" class="size-4" />
      <Moon v-else class="size-4" />
    </div>
  </button>
</template>
