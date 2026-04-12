<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ErrorBoundary from '@/presentation/components/error/error-boundary.vue'
import AppShell from '@/presentation/components/layout/app-shell.vue'
import { useSettings } from '@/application/use-settings'

const { locale } = useI18n()
const { language } = useSettings()

// Sync i18n locale with settings
watch(
  language,
  (newLang) => {
    locale.value = newLang
  },
  { immediate: true },
)
</script>

<template>
  <ErrorBoundary>
    <AppShell />
  </ErrorBoundary>
</template>
