<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Download, Upload, Info } from 'lucide-vue-next'
import { useSettings } from '@/application/use-settings'
import { useModal } from '@/presentation/composables/use-modal'
import { useToast } from '@/presentation/composables/use-toast'
import SettingsRow from '@/presentation/components/settings/SettingsRow.vue'
import ThemeToggle from '@/presentation/components/settings/ThemeToggle.vue'
import LayoutModeToggle from '@/presentation/components/settings/LayoutModeToggle.vue'
import SettingsSelect from '@/presentation/components/settings/SettingsSelect.vue'

const { t } = useI18n()
const {
  language,
  preferredRegion,
  layoutMode,
  theme,
  defaultHomeSection,
  triggerExport,
  handleImportFile,
} = useSettings()

const { open: openModal } = useModal()
const { addToast } = useToast()

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
]

const regions = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'FR', label: 'France' },
  { value: 'ES', label: 'Spain' },
  { value: 'DE', label: 'Germany' },
]

const homeSections = [
  { value: 'trending', label: t('home.sections.trending') },
  { value: 'popular', label: t('home.sections.popular') },
  { value: 'search', label: t('home.sections.search') },
]

/**
 * Handles library export.
 */
async function handleExport() {
  try {
    await triggerExport()
    addToast({ message: t('settings.data.exportSuccess'), type: 'success' })
  } catch {
    addToast({ message: t('settings.data.exportError'), type: 'error' })
  }
}

/**
 * Handles library import button click.
 */
function handleImportClick() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    // 1. Initial Strategy selection
    openModal({
      title: t('settings.import.title'),
      content: t('settings.import.description'),
      confirmLabel: t('settings.import.overwrite'),
      cancelLabel: t('settings.import.merge'),
      onConfirm: () => confirmOverwrite(file),
      onCancel: () => performImport(file, 'merge'),
    })
  }
  input.click()
}

/**
 * Secondary confirmation for overwrite strategy.
 */
function confirmOverwrite(file: File) {
  openModal({
    title: t('settings.import.confirmOverwriteTitle'),
    content: t('settings.import.confirmOverwriteDescription'),
    confirmLabel: t('settings.import.confirmOverwriteButton'),
    cancelLabel: t('modal.cancel'),
    onConfirm: () => performImport(file, 'overwrite'),
  })
}

/**
 * Performs the actual import.
 */
async function performImport(file: File, strategy: 'merge' | 'overwrite') {
  try {
    await handleImportFile(file, strategy)
    addToast({ message: t('settings.data.importSuccess'), type: 'success' })
  } catch (err) {
    addToast({
      message: (err as Error).message || t('settings.data.importError'),
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-12 pb-20">
    <!-- Header -->
    <header class="space-y-2">
      <h1 class="text-3xl font-bold text-white">{{ t('settings.title') }}</h1>
      <p class="text-slate-400">{{ t('settings.description') }}</p>
    </header>

    <!-- Appearance -->
    <section class="space-y-4">
      <h2 class="border-b border-slate-800 pb-2 text-xl font-bold text-white">
        {{ t('settings.sections.appearance') }}
      </h2>
      <div class="divide-y divide-slate-800">
        <SettingsRow
          :label="t('settings.appearance.theme.label')"
          :description="t('settings.appearance.theme.description')"
        >
          <ThemeToggle v-model="theme" />
        </SettingsRow>

        <SettingsRow
          :label="t('settings.appearance.layout.label')"
          :description="t('settings.appearance.layout.description')"
        >
          <LayoutModeToggle v-model="layoutMode" />
        </SettingsRow>
      </div>
    </section>

    <!-- Content & UI -->
    <section class="space-y-4">
      <h2 class="border-b border-slate-800 pb-2 text-xl font-bold text-white">
        {{ t('settings.sections.content') }}
      </h2>
      <div class="divide-y divide-slate-800">
        <SettingsRow
          :label="t('settings.content.language.label')"
          :description="t('settings.content.language.description')"
        >
          <SettingsSelect v-model="language" :options="languages" />
        </SettingsRow>

        <SettingsRow
          :label="t('settings.content.region.label')"
          :description="t('settings.content.region.description')"
        >
          <SettingsSelect v-model="preferredRegion" :options="regions" />
        </SettingsRow>
      </div>
    </section>

    <!-- Navigation & Defaults -->
    <section class="space-y-4">
      <h2 class="border-b border-slate-800 pb-2 text-xl font-bold text-white">
        {{ t('settings.sections.navigation') }}
      </h2>
      <div class="divide-y divide-slate-800">
        <SettingsRow
          :label="t('settings.navigation.home.label')"
          :description="t('settings.navigation.home.description')"
        >
          <SettingsSelect v-model="defaultHomeSection" :options="homeSections" />
        </SettingsRow>
      </div>
    </section>

    <!-- Data Management -->
    <section class="space-y-4">
      <h2 class="border-b border-slate-800 pb-2 text-xl font-bold text-white">
        {{ t('settings.sections.data') }}
      </h2>
      <div class="bg-slate-900/50 rounded-lg p-6 space-y-6 border border-slate-800">
        <div class="flex items-start gap-4">
          <div class="rounded-full bg-teal-500/10 p-3 text-accent">
            <Info class="size-6" />
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-medium text-white">{{ t('settings.data.info.title') }}</h3>
            <p class="text-sm text-slate-400">{{ t('settings.data.info.description') }}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg bg-surface px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            @click="handleExport"
          >
            <Download class="size-4" />
            {{ t('settings.data.export') }}
          </button>
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg bg-surface px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            @click="handleImportClick"
          >
            <Upload class="size-4" />
            {{ t('settings.data.import') }}
          </button>
        </div>
      </div>
    </section>

    <!-- App Info -->
    <footer class="pt-8 text-center text-xs text-slate-500">
      <p>Plot Twisted v1.0.0</p>
      <p class="mt-1">{{ t('settings.footer.legal') }}</p>
    </footer>
  </div>
</template>
