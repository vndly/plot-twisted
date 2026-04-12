<script setup lang="ts">
defineProps<{
  label: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
    <div class="flex flex-col gap-1">
      <span class="text-base font-medium text-white">{{ label }}</span>
      <span v-if="description" class="text-sm text-slate-400">{{ description }}</span>
    </div>
    <div class="flex shrink-0 items-center">
      <slot />
    </div>
  </div>
</template>
