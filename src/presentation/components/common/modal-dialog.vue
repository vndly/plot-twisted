<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModal } from '@/presentation/composables/use-modal'

const { t } = useI18n()
const { isOpen, props, close } = useModal()

/**
 * Handles confirm button click — invokes callback if provided and closes modal.
 */
function handleConfirm(): void {
  props.value?.onConfirm?.()
  close()
}

/**
 * Handles cancel button click — invokes callback if provided and closes modal.
 */
function handleCancel(): void {
  props.value?.onCancel?.()
  close()
}

/**
 * Handles Escape key press to close the modal.
 */
function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    close()
  }
}

// Register/unregister Escape key listener based on modal open state.
// The watch with immediate: true handles the mount case.
watch(
  isOpen,
  (open) => {
    if (open) {
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen && props"
      data-testid="modal-backdrop"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
      @click.self="close"
    >
      <div
        data-testid="modal-content"
        class="mx-4 max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-surface p-6 shadow-lg"
        @click.stop
      >
        <h2 data-testid="modal-title" class="text-lg font-bold text-white">
          {{ props.title }}
        </h2>

        <p v-if="props.content" data-testid="modal-body" class="mt-3 text-sm text-slate-300">
          {{ props.content }}
        </p>

        <div data-testid="modal-footer" class="mt-6 flex justify-end gap-3">
          <button
            data-testid="modal-cancel"
            class="min-h-11 cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            @click="handleCancel"
          >
            {{ props.cancelLabel ?? t('modal.cancel') }}
          </button>
          <button
            data-testid="modal-confirm"
            class="min-h-11 cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/80"
            @click="handleConfirm"
          >
            {{ props.confirmLabel ?? t('modal.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
