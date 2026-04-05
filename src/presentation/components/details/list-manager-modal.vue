<script setup lang="ts">
import { ref } from 'vue'
import { Plus, X, List as ListIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useLists } from '@/application/use-lists'

const props = defineProps<{
  entryLists: string[]
}>()

const emit = defineEmits<{
  'update:entryLists': [lists: string[]]
}>()

const isOpen = defineModel<boolean>({ default: false })

const { t } = useI18n()
const { lists, createList } = useLists()

const newListName = ref('')

/**
 * Toggles a list ID in the entry's lists array.
 * @param listId - The UUID of the list
 */
function toggleList(listId: string) {
  const current = [...props.entryLists]
  const index = current.indexOf(listId)

  if (index >= 0) {
    current.splice(index, 1)
  } else {
    current.push(listId)
  }

  emit('update:entryLists', current)
}

/**
 * Handles creation of a new list.
 */
function onCreateList() {
  const name = newListName.value.trim()
  if (!name) return

  createList(name)
  newListName.value = ''
}

/**
 * Closes the modal.
 */
function close() {
  isOpen.value = false
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="close"
    >
      <div
        class="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-surface shadow-2xl"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-white/10 p-4">
          <h2 class="flex items-center gap-2 text-lg font-bold text-white">
            <ListIcon class="size-5 text-accent" />
            {{ t('library.lists.manageTitle') }}
          </h2>
          <button
            class="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            @click="close"
          >
            <X class="size-6" />
          </button>
        </div>

        <!-- List Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="lists.length > 0" class="space-y-2">
            <label
              v-for="list in lists"
              :key="list.id"
              class="list-item flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-3 transition-colors hover:bg-white/5"
              :class="{ 'border-accent/20 bg-accent/5': entryLists.includes(list.id) }"
            >
              <input
                type="checkbox"
                class="size-5 rounded border-white/20 bg-surface-variant text-accent focus:ring-accent"
                :checked="entryLists.includes(list.id)"
                @change="toggleList(list.id)"
              />
              <span class="font-medium text-white">{{ list.name }}</span>
            </label>
          </div>

          <!-- Empty State for lists -->
          <div v-else class="py-8 text-center text-slate-400">
            <p class="text-sm">{{ t('library.lists.noLists') }}</p>
          </div>
        </div>

        <!-- Footer / Create New List -->
        <div class="border-t border-white/10 bg-surface-variant/30 p-4">
          <form class="flex gap-2" @submit.prevent="onCreateList">
            <input
              v-model="newListName"
              type="text"
              class="flex-1 rounded-lg border border-white/10 bg-surface-variant px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              :placeholder="t('library.lists.newNamePlaceholder')"
            />
            <button
              type="submit"
              class="create-list-button flex size-10 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent/80 disabled:opacity-50"
              :disabled="!newListName.trim()"
            >
              <Plus class="size-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
