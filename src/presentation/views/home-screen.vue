<script setup lang="ts">
import { useSearch } from '@/application/use-search'
import SearchBar from '@/presentation/components/home/search-bar.vue'
import SearchResults from '@/presentation/components/home/search-results.vue'

const { query, results, loading, error, isSearchMode, retry } = useSearch()

/**
 * Handles retry event from SearchResults.
 */
function handleRetry() {
  retry()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Search Bar -->
    <SearchBar v-model="query" />

    <!-- Search Mode: Show results -->
    <SearchResults
      v-if="isSearchMode"
      :results="results"
      :loading="loading"
      :error="error"
      :query="query"
      @retry="handleRetry"
    />

    <!-- Browse Mode: Placeholder for future browse sections -->
    <div v-else data-testid="browse-sections">
      <!-- TrendingCarousel, PopularGrid, FilterBar, ViewToggle will go here -->
      <!-- Stub comment: Browse sections are planned for a future home-browse feature -->
    </div>
  </div>
</template>
