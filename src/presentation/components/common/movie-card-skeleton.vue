<script setup lang="ts">
// MovieCardSkeleton - Loading placeholder for MovieCard
// Matches MovieCard dimensions with 2:3 aspect ratio poster and text lines
</script>

<template>
  <div class="space-y-2" aria-hidden="true">
    <!-- Poster skeleton with 2:3 aspect ratio -->
    <div data-testid="poster-skeleton" class="aspect-[2/3] animate-pulse rounded-lg bg-surface" />

    <!-- Title skeleton -->
    <div data-testid="title-skeleton" class="h-4 w-3/4 animate-pulse rounded bg-surface" />

    <!-- Year skeleton -->
    <div data-testid="year-skeleton" class="h-3 w-1/4 animate-pulse rounded bg-surface" />
  </div>
</template>
