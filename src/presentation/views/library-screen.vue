<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Bookmark, Eye, List as ListIcon, Plus } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useLibraryEntries } from '@/application/use-library-entries'
import { useLists } from '@/application/use-lists'
import TabToggle from '@/presentation/components/common/tab-toggle.vue'
import EntryGrid from '@/presentation/components/common/entry-grid.vue'
import EmptyState from '@/presentation/components/common/empty-state.vue'

const { t } = useI18n()
const { getEntriesByStatus, getEntriesByList } = useLibraryEntries()
const { lists, createList } = useLists()

type TabId = 'watchlist' | 'watched' | 'lists'
const activeTab = ref<TabId>('watchlist')
const selectedListId = ref<string | null>(null)

const tabs = [
  { id: 'watchlist', label: t('library.tabs.watchlist') },
  { id: 'watched', label: t('library.tabs.watched') },
  { id: 'lists', label: t('library.tabs.lists') },
]

/**
 * Computed entries based on active tab and selected list.
 */
const filteredEntries = computed(() => {
  if (activeTab.value === 'watchlist') {
    return getEntriesByStatus('watchlist')
  } else if (activeTab.value === 'watched') {
    return getEntriesByStatus('watched')
  } else if (activeTab.value === 'lists' && selectedListId.value) {
    return getEntriesByList(selectedListId.value)
  }
  return []
})

// Set initial list if lists exist and tab is 'lists'
watch(
  [activeTab, lists],
  ([newTab, newLists]) => {
    if (newTab === 'lists' && !selectedListId.value && newLists.length > 0) {
      selectedListId.value = newLists[0].id
    }
  },
  { immediate: true },
)

/**
 * Handles tab change.
 */
function handleTabChange(tabId: string) {
  activeTab.value = tabId as TabId
}

/**
 * Handles list selection.
 */
function selectList(id: string) {
  selectedListId.value = id
}

const newListName = ref('')

/**
 * Handles creating a new list.
 */
function handleCreateList() {
  const name = newListName.value.trim()
  if (!name) return
  createList(name)
  newListName.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-6 p-4 md:p-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-white">{{ t('page.library.title') }}</h1>
      <div class="w-full sm:w-64">
        <TabToggle :tabs="tabs" :active-tab="activeTab" @update:active-tab="handleTabChange" />
      </div>
    </header>

    <!-- Custom Lists Selector (only visible in 'lists' tab) -->
    <div v-if="activeTab === 'lists' && lists.length > 0" class="flex flex-wrap gap-2">
      <button
        v-for="list in lists"
        :key="list.id"
        class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
        :class="
          selectedListId === list.id
            ? 'bg-accent text-white'
            : 'bg-surface text-slate-400 hover:text-white'
        "
        @click="selectList(list.id)"
      >
        {{ list.name }}
      </button>
    </div>

    <!-- Main Content -->
    <main>
      <div v-if="filteredEntries.length > 0">
        <EntryGrid :entries="filteredEntries" />
      </div>

      <!-- Empty States -->
      <div v-else>
        <!-- Watchlist Empty -->
        <EmptyState
          v-if="activeTab === 'watchlist'"
          :icon="Bookmark"
          :title="t('library.empty.watchlist.title')"
          :description="t('library.empty.watchlist.description')"
        />

        <!-- Watched Empty -->
        <EmptyState
          v-else-if="activeTab === 'watched'"
          :icon="Eye"
          :title="t('library.empty.watched.title')"
          :description="t('library.empty.watched.description')"
        />

        <!-- List Empty (specific list) -->
        <EmptyState
          v-else-if="activeTab === 'lists' && selectedListId"
          :icon="ListIcon"
          :title="t('library.empty.list.title')"
          :description="t('library.empty.list.description')"
        />

        <!-- No Lists at all -->
        <div v-else-if="activeTab === 'lists' && lists.length === 0" class="py-12">
          <EmptyState
            :icon="ListIcon"
            :title="t('library.empty.allLists.title')"
            :description="t('library.empty.allLists.description')"
          >
            <form class="mt-6 flex w-full max-w-xs gap-2" @submit.prevent="handleCreateList">
              <input
                v-model="newListName"
                type="text"
                class="flex-1 rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-accent focus:outline-none"
                :placeholder="t('library.lists.newNamePlaceholder')"
              />
              <button
                type="submit"
                class="flex size-10 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent/80"
                :disabled="!newListName.trim()"
              >
                <Plus class="size-5" />
              </button>
            </form>
          </EmptyState>
        </div>
      </div>
    </main>
  </div>
</template>
