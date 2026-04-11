<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { useI18n } from 'vue-i18n'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

defineProps<{
  /** Chart.js formatted data object */
  data: ChartData<'bar'>
}>()

const { t } = useI18n()

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#fff',
      bodyColor: '#94a3b8',
      borderColor: '#334155',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#94a3b8',
      },
    },
    y: {
      grid: {
        color: '#1e293b',
      },
      ticks: {
        color: '#94a3b8',
        precision: 0,
      },
    },
  },
}
</script>

<template>
  <div class="flex flex-col gap-4 rounded-xl bg-surface p-6" data-testid="monthly-chart">
    <h3 class="text-sm font-bold text-white">{{ t('stats.charts.monthly.title') }}</h3>
    <div class="h-64 w-full">
      <Bar :data="data" :options="options" />
    </div>
  </div>
</template>
