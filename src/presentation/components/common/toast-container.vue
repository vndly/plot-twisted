<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { X } from 'lucide-vue-next'
import { useToast } from '@/presentation/composables/use-toast'

const { t } = useI18n()
const { toasts, removeToast } = useToast()

/**
 * Returns the Tailwind border color class for the given toast type.
 */
function getBorderClass(type: 'error' | 'success' | 'info'): string {
  switch (type) {
    case 'error':
      return 'border-l-error'
    case 'success':
      return 'border-l-success'
    case 'info':
      return 'border-l-accent'
  }
}
</script>

<template>
  <div data-testid="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-3">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :data-toast-id="toast.id"
        data-testid="toast-item"
        class="flex min-w-72 items-center gap-3 rounded-lg border-l-4 bg-surface p-4 shadow-lg"
        :class="getBorderClass(toast.type)"
      >
        <span class="flex-1 text-sm text-white">{{ toast.message }}</span>

        <div class="flex items-center gap-1">
          <button
            v-if="toast.action"
            data-testid="toast-action"
            class="min-h-11 min-w-11 cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-white/10"
            @click="toast.action.handler"
          >
            {{ toast.action.label }}
          </button>

          <button
            data-testid="toast-dismiss"
            :aria-label="t('toast.dismiss')"
            class="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            @click="removeToast(toast.id)"
          >
            <X class="size-5" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
