<script setup lang="ts">
import { RouterView } from 'vue-router'
import ErrorBoundary from '@/presentation/components/error/error-boundary.vue'
</script>

<template>
  <ErrorBoundary>
    <div class="min-h-screen bg-bg-primary text-white">
      <RouterView />
    </div>
  </ErrorBoundary>
</template>
