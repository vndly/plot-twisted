<script setup lang="ts">
import { LayoutGrid, List } from 'lucide-vue-next'

defineProps<{
  modelValue: 'grid' | 'list'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'grid' | 'list'): void
}>()
</script>

<template>
  <div class="flex items-center gap-1 rounded-lg bg-surface p-1">
    <button
      type="button"
      class="flex h-8 w-10 items-center justify-center rounded-md transition-colors"
      :class="modelValue === 'grid' ? 'bg-accent text-white' : 'text-slate-400 hover:text-white'"
      @click="emit('update:modelValue', 'grid')"
    >
      <LayoutGrid class="size-4" />
    </button>
    <button
      type="button"
      class="flex h-8 w-10 items-center justify-center rounded-md transition-colors"
      :class="modelValue === 'list' ? 'bg-accent text-white' : 'text-slate-400 hover:text-white'"
      @click="emit('update:modelValue', 'list')"
    >
      <List class="size-4" />
    </button>
  </div>
</template>
