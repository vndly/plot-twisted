<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Download, Upload, Info, Trash2 } from 'lucide-vue-next'
import { useSettings } from '@/application/use-settings'
import { useModal } from '@/presentation/composables/use-modal'
import { useToast } from '@/presentation/composables/use-toast'
import SettingsRow from '@/presentation/components/settings/SettingsRow.vue'
import ThemeToggle from '@/presentation/components/settings/ThemeToggle.vue'
import SettingsSelect from '@/presentation/components/settings/SettingsSelect.vue'

const { t } = useI18n()
const { language, theme, triggerExport, handleImportFile, deleteAllData } = useSettings()

const { open: openModal } = useModal()
const { addToast } = useToast()

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
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

/**
 * Opens the destructive delete-all-data confirmation.
 */
function handleDeleteAllClick() {
  openModal({
    title: t('settings.delete.title'),
    content: t('settings.delete.description'),
    confirmLabel: t('settings.delete.confirm'),
    cancelLabel: t('modal.cancel'),
    onConfirm: performDeleteAllData,
  })
}

/**
 * Deletes all local user data after confirmation.
 */
function performDeleteAllData() {
  try {
    deleteAllData()
    addToast({ message: t('settings.delete.success'), type: 'success' })
  } catch {
    addToast({ message: t('settings.delete.error'), type: 'error' })
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-12 pb-20 pt-2">
    <!-- Header -->
    <header class="space-y-2">
      <h1 class="text-3xl font-bold text-slate-950 dark:text-white">
        {{ t('settings.title') }}
      </h1>
      <p class="text-slate-600 dark:text-slate-400">{{ t('settings.description') }}</p>
    </header>

    <!-- Appearance -->
    <section class="space-y-4">
      <h2
        class="border-b border-slate-200 pb-2 text-xl font-bold text-slate-950 dark:border-slate-800 dark:text-white"
      >
        {{ t('settings.sections.appearance') }}
      </h2>
      <div class="divide-y divide-slate-200 dark:divide-slate-800">
        <SettingsRow
          :label="t('settings.appearance.theme.label')"
          :description="t('settings.appearance.theme.description')"
        >
          <ThemeToggle v-model="theme" />
        </SettingsRow>
      </div>
    </section>

    <!-- Content & UI -->
    <section class="space-y-4">
      <h2
        class="border-b border-slate-200 pb-2 text-xl font-bold text-slate-950 dark:border-slate-800 dark:text-white"
      >
        {{ t('settings.sections.content') }}
      </h2>
      <div class="divide-y divide-slate-200 dark:divide-slate-800">
        <SettingsRow
          :label="t('settings.content.language.label')"
          :description="t('settings.content.language.description')"
        >
          <SettingsSelect v-model="language" :options="languages" />
        </SettingsRow>
      </div>
    </section>

    <!-- Data Management -->
    <section class="space-y-4">
      <h2
        class="border-b border-slate-200 pb-2 text-xl font-bold text-slate-950 dark:border-slate-800 dark:text-white"
      >
        {{ t('settings.sections.data') }}
      </h2>
      <div
        class="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none"
      >
        <div class="flex items-start gap-4">
          <div class="rounded-full bg-teal-500/10 p-3 text-accent">
            <Info class="size-6" />
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-medium text-slate-950 dark:text-white">
              {{ t('settings.data.info.title') }}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              {{ t('settings.data.info.description') }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200 dark:bg-surface dark:text-white dark:hover:bg-slate-700"
            @click="handleExport"
          >
            <Download class="size-4" />
            {{ t('settings.data.export') }}
          </button>
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200 dark:bg-surface dark:text-white dark:hover:bg-slate-700"
            @click="handleImportClick"
          >
            <Upload class="size-4" />
            {{ t('settings.data.import') }}
          </button>
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
            @click="handleDeleteAllClick"
          >
            <Trash2 class="size-4" />
            {{ t('settings.delete.button') }}
          </button>
        </div>
      </div>
    </section>

    <!-- App Info -->
    <footer class="pt-8 text-center text-xs text-slate-500">
      <p>Plot Twisted v1.0.0</p>
    </footer>
  </div>
</template>
