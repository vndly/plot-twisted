<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { MovieListItem } from '@/domain/movie.schema'
import { buildImageUrl } from '@/infrastructure/image.helper'
import { IMAGE_SIZES } from '@/domain/constants'

const props = defineProps<{
  movie: MovieListItem
}>()

const router = useRouter()

const posterUrl = computed(() => {
  return buildImageUrl(props.movie.poster_path, IMAGE_SIZES.poster.small)
})

function navigateToDetail() {
  router.push(`/movie/${props.movie.id}`)
}
</script>

<template>
  <div
    class="group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded bg-slate-800/50 p-1 transition-all duration-200 hover:bg-slate-700/50 hover:scale-105"
    role="button"
    :aria-label="movie.title"
    @click="navigateToDetail"
  >
    <div class="h-8 w-6 flex-shrink-0 overflow-hidden rounded-sm bg-slate-700">
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="movie.title"
        class="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
    <div class="min-w-0 flex-1">
      <h4
        class="truncate text-[10px] font-medium leading-tight text-white group-hover:text-teal-400"
      >
        {{ movie.title }}
      </h4>
    </div>
  </div>
</template>
