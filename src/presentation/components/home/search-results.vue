<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AlertCircle } from 'lucide-vue-next'
import type { MovieListItem } from '@/domain/movie.schema'
import type { ShowListItem } from '@/domain/show.schema'
import MovieCard from '@/presentation/components/common/movie-card.vue'
import MovieCardSkeleton from '@/presentation/components/common/movie-card-skeleton.vue'

type MediaResult = (MovieListItem | ShowListItem) & { media_type: 'movie' | 'tv' }

const props = defineProps<{
  results: MediaResult[]
  loading: boolean
  error: Error | null
  hasSearched: boolean
  query: string
}>()

const emit = defineEmits<{
  retry: []
}>()

const router = useRouter()
const { t } = useI18n()

/** Number of skeleton cards to show during loading. */
const SKELETON_COUNT = 8

/** Whether to show the empty state. */
const showEmptyState = (): boolean => {
  return (
    props.hasSearched &&
    !props.loading &&
    !props.error &&
    props.results.length === 0 &&
    props.query.trim().length > 0
  )
}

/**
 * Navigates to the detail page for the given result.
 */
function handleCardClick(result: MediaResult) {
  const path = result.media_type === 'movie' ? `/movie/${result.id}` : `/show/${result.id}`
  router.push(path)
}

/**
 * Handles retry button click.
 */
function handleRetry() {
  emit('retry')
}
</script>

<template>
  <!-- Loading state -->
  <div
    v-if="loading"
    data-testid="results-grid"
    class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
  >
    <MovieCardSkeleton v-for="n in SKELETON_COUNT" :key="n" />
  </div>

  <!-- Error state -->
  <div
    v-else-if="error"
    data-testid="error-container"
    class="flex flex-col items-center gap-4 py-8"
  >
    <AlertCircle class="size-8 text-red-500" aria-hidden="true" />
    <p class="text-red-500">{{ t('home.search.error.message') }}</p>
    <button
      data-testid="retry-button"
      class="cursor-pointer rounded-md bg-accent px-4 py-2 text-white transition-colors hover:bg-accent/80"
      @click="handleRetry"
    >
      {{ t('home.search.error.retry') }}
    </button>
  </div>

  <!-- Empty state -->
  <div
    v-else-if="showEmptyState()"
    data-testid="empty-state"
    class="flex min-h-48 flex-col items-center justify-center gap-2 py-16 text-center"
  >
    <h3 class="text-lg font-bold text-white">{{ t('home.search.empty.title') }}</h3>
    <p class="text-slate-400">{{ t('home.search.empty.subtitle') }}</p>
  </div>

  <!-- Results grid -->
  <div
    v-else-if="results.length > 0"
    data-testid="results-grid"
    class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
  >
    <MovieCard
      v-for="result in results"
      :key="`${result.media_type}-${result.id}`"
      :item="result"
      @click="handleCardClick(result)"
    />
  </div>
</template>
