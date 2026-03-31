<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    reloadPage?: () => void
  }>(),
  {
    reloadPage: () => window.location.reload(),
  },
)

const { t } = useI18n()
const hasError = ref(false)

/**
 * Reloads the current page after an unrecoverable UI crash.
 */
function handleReload(): void {
  props.reloadPage()
}

onErrorCaptured(() => {
  hasError.value = true
  return false
})
</script>

<template>
  <div
    v-if="hasError"
    role="alert"
    class="flex min-h-screen items-center justify-center bg-bg-primary px-6 py-8"
  >
    <div class="w-full max-w-lg rounded-2xl bg-surface px-8 py-10 text-center shadow-2xl">
      <div class="space-y-4">
        <h1 class="text-3xl font-bold text-white">{{ t('common.error.title') }}</h1>
        <p class="text-base text-slate-400">{{ t('common.error.description') }}</p>
        <button
          data-testid="error-boundary-reload"
          class="min-h-11 cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/80"
          @click="handleReload"
        >
          {{ t('common.error.reload') }}
        </button>
      </div>
    </div>
  </div>

  <slot v-else />
</template>
