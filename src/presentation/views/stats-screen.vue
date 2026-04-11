<script setup lang="ts">
import { computed } from 'vue'
import { ChartColumn } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useStats } from '@/application/use-stats'
import EmptyState from '@/presentation/components/common/empty-state.vue'
import StatCards from '@/presentation/components/stats/stat-cards.vue'
import GenreChart from '@/presentation/components/stats/genre-chart.vue'
import MonthlyChart from '@/presentation/components/stats/monthly-chart.vue'
import TopRatedList from '@/presentation/components/stats/top-rated-list.vue'

const { t } = useI18n()
const { metrics, genreChartData, monthlyChartData, topRatedItems } = useStats()

/** Show empty state if no watched items exist */
const hasWatchedItems = computed(() => metrics.value.totalWatched > 0)
</script>

<template>
  <div v-if="hasWatchedItems" class="flex flex-col gap-8 pb-10" data-testid="stats-screen">
    <!-- Header -->
    <header class="flex flex-col gap-2">
      <h1 class="text-3xl font-bold text-white">{{ t('stats.title') }}</h1>
      <p class="text-slate-400">{{ t('stats.description') }}</p>
    </header>

    <!-- Key Metrics (SU-01) -->
    <StatCards :metrics="metrics" />

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <!-- Charts Column (Left) -->
      <div class="flex flex-col gap-8 lg:col-span-7">
        <!-- Genre Distribution (SU-02) -->
        <GenreChart :data="genreChartData" />
        <!-- Monthly Activity (SU-03) -->
        <MonthlyChart :data="monthlyChartData" />
      </div>

      <!-- Rankings Column (Right) -->
      <div class="flex flex-col gap-8 lg:col-span-5">
        <!-- Top Rated (SU-04) -->
        <TopRatedList :items="topRatedItems" />
      </div>
    </div>
  </div>

  <!-- Empty State (SU-05) -->
  <EmptyState
    v-else
    :icon="ChartColumn"
    :title="t('stats.empty.title')"
    :description="t('stats.empty.description')"
  />
</template>
