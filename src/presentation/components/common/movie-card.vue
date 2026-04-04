<script setup lang="ts">
import { computed } from 'vue'
import { Film, Star } from 'lucide-vue-next'
import type { MovieListItem } from '@/domain/movie.schema'
import type { ShowListItem } from '@/domain/show.schema'
import { buildImageUrl } from '@/infrastructure/image.helper'
import { IMAGE_SIZES } from '@/domain/constants'

const props = defineProps<{
  item: (MovieListItem | ShowListItem) & { media_type?: 'movie' | 'tv' }
}>()

const emit = defineEmits<{
  click: []
}>()

/** Returns the title for movies or name for TV shows. */
const displayTitle = computed(() => {
  if ('title' in props.item) {
    return props.item.title
  }
  return props.item.name
})

/** Returns the release year from release_date or first_air_date. */
const displayYear = computed(() => {
  const date = 'release_date' in props.item ? props.item.release_date : props.item.first_air_date
  if (!date) {
    return ''
  }
  return date.substring(0, 4)
})

/** Returns the formatted vote average (one decimal place). */
const displayRating = computed(() => {
  return props.item.vote_average.toFixed(1)
})

/** Returns the poster URL or null if no poster available. */
const posterUrl = computed(() => {
  return buildImageUrl(props.item.poster_path, IMAGE_SIZES.poster.medium)
})

/**
 * Handles click event on the card.
 */
function handleClick() {
  emit('click')
}

/**
 * Handles keyboard navigation for accessibility.
 */
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click')
  }
}
</script>

<template>
  <article
    class="group cursor-pointer transition-transform duration-200 hover:scale-105"
    role="button"
    tabindex="0"
    :aria-label="displayTitle"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- Poster with 2:3 aspect ratio -->
    <div class="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface">
      <!-- Poster image -->
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="displayTitle"
        loading="lazy"
        class="size-full object-cover"
      />
      <!-- Placeholder when no poster -->
      <div
        v-else
        class="flex size-full items-center justify-center text-slate-500"
        aria-hidden="true"
      >
        <Film class="size-12" />
      </div>

      <!-- Rating badge -->
      <div
        v-if="item.vote_average > 0"
        class="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white"
      >
        <Star class="size-3 fill-current" aria-hidden="true" />
        <span>{{ displayRating }}</span>
      </div>
    </div>

    <!-- Title and year -->
    <div class="mt-2">
      <h3 class="truncate text-sm font-medium text-white">{{ displayTitle }}</h3>
      <p v-if="displayYear" class="text-xs text-slate-400">{{ displayYear }}</p>
    </div>
  </article>
</template>
