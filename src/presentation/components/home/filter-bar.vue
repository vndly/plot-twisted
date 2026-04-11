<script setup lang="ts">
import { useFilters } from '@/application/use-filters'
import FilterBar from '@/presentation/components/common/filter-bar.vue'

const { filters, genres, clearAll, activeFilterCount } = useFilters()
</script>

<template>
  <FilterBar
    v-model="filters"
    :genres="genres"
    :active-filter-count="activeFilterCount"
    show-genre
    show-media-type
    show-year-range
    @clear="clearAll"
  />
</template>
