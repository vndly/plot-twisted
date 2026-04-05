<script setup lang="ts">
defineProps<{
  tabs: Array<{ id: string; label: string }>
  activeTab: string
}>()

defineEmits<{
  'update:activeTab': [id: string]
}>()
</script>

<template>
  <div class="flex rounded-lg bg-surface-variant p-1">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200"
      :class="
        activeTab === tab.id
          ? 'bg-accent text-white shadow-sm'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      "
      @click="$emit('update:activeTab', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
