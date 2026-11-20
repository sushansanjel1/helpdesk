<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Search, SlidersHorizontal, X } from 'lucide-vue-next'
import {
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui'

const props = withDefaults(
  defineProps<{
    filteredCount: number
    totalCount: number
    showStatusFilter?: boolean
  }>(),
  {
    showStatusFilter: true,
  },
)

const searchQuery = ref('')

//Multiple status and priority sections
const selectedStatus = ref<string[]>([])
const selectedPriority = ref<string[]>([])

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

const emit = defineEmits<{
  (
    event: 'filter-change',
    filters: {
      searchQuery: string
      selectedStatus: string[]
      selectedPriority: string[]
    },
  ): void
}>()

const emitFilters = () => {
  emit('filter-change', {
    searchQuery: searchQuery.value,
    selectedStatus: [...selectedStatus.value],
    selectedPriority: [...selectedPriority.value],
  })
}

//Toggle individual filter selections
const toggleStatus = (status: string, checked: boolean) => {
  selectedStatus.value = checked
    ? [...selectedStatus.value, status]
    : selectedStatus.value.filter((item) => item !== status)
}

const togglePriority = (priority: string, checked: boolean) => {
  selectedPriority.value = checked
    ? [...selectedPriority.value, priority]
    : selectedPriority.value.filter((item) => item !== priority)
}
//Remove individual selections from the filter input
const removeStatus = (status: string) => {
  selectedStatus.value = selectedStatus.value.filter((item) => item !== status)
}

const removePriority = (priority: string) => {
  selectedPriority.value = selectedPriority.value.filter((item) => item !== priority)
}

const hasVisibleFilters = computed(() => {
  return (
    (props.showStatusFilter && selectedStatus.value.length > 0) || selectedPriority.value.length > 0
  )
})

//Clear everything
const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = []
  selectedPriority.value = []
}

watch([searchQuery, selectedStatus, selectedPriority], emitFilters, { deep: true })
</script>

<template>
  <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
    <!-- Search Input -->
    <div class="relative min-w-0 flex-1">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <Input v-model="searchQuery" placeholder="Search tickets..." class="h-11 pl-10 pr-10" />

      <button
        v-if="searchQuery"
        type="button"
        @click="searchQuery = ''"
        aria-label="Clear search"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Unified Filter Dropdown -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <div
          role="button"
          tabindex="0"
          class="flex min-h-11 w-full cursor-pointer flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-slate-50 sm:flex-1"
        >
          <SlidersHorizontal class="h-4 w-4 shrink-0 text-slate-400" />

          <!-- Default label -->
          <span v-if="!hasVisibleFilters" class="text-slate-500"> Filters </span>

          <!-- Selected Status Chips -->
          <template v-if="props.showStatusFilter">
            <span
              v-for="status in statusOptions.filter((item) => selectedStatus.includes(item.value))"
              :key="status.value"
              class="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
            >
              {{ status.label }}

              <button
                type="button"
                @click.stop="removeStatus(status.value)"
                :aria-label="`Remove ${status.label} filter`"
                class="rounded-full hover:text-blue-900"
              >
                <X class="h-3 w-3" />
              </button>
            </span>
          </template>

          <!-- Selected Priority Chips -->
          <span
            v-for="priority in priorityOptions.filter((item) =>
              selectedPriority.includes(item.value),
            )"
            :key="priority.value"
            class="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
          >
            {{ priority.label }}

            <button
              type="button"
              @click.stop="removePriority(priority.value)"
              :aria-label="`Remove ${priority.label} filter`"
              class="rounded-full hover:text-blue-900"
            >
              <X class="h-3 w-3" />
            </button>
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" class="w-56">
        <!-- Dropdown Heading -->
        <DropdownMenuLabel class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Filter by
        </DropdownMenuLabel>

        <!-- Status Submenu: Hidden in Kanban view -->
        <DropdownMenuSub v-if="props.showStatusFilter">
          <DropdownMenuSubTrigger> Status </DropdownMenuSubTrigger>

          <DropdownMenuSubContent class="w-48">
            <DropdownMenuCheckboxItem
              v-for="status in statusOptions"
              :key="status.value"
              :model-value="selectedStatus.includes(status.value)"
              @update:model-value="(checked: boolean) => toggleStatus(status.value, checked)"
              @select.prevent
            >
              {{ status.label }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <!-- Priority Submenu -->
        <DropdownMenuSub>
          <DropdownMenuSubTrigger> Priority </DropdownMenuSubTrigger>

          <DropdownMenuSubContent class="w-48">
            <DropdownMenuCheckboxItem
              v-for="priority in priorityOptions"
              :key="priority.value"
              :model-value="selectedPriority.includes(priority.value)"
              @update:model-value="(checked: boolean) => togglePriority(priority.value, checked)"
              @select.prevent
            >
              {{ priority.label }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <button
          type="button"
          @click="clearFilters"
          class="w-full rounded-sm px-2 py-2 text-left text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Clear all filters
        </button>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Results Count -->
    <p class="shrink-0 text-sm text-slate-500 sm:ml-auto">
      Showing
      <span class="font-semibold text-slate-900">
        {{ props.filteredCount }}
      </span>
      of
      <span class="font-semibold text-slate-900">
        {{ props.totalCount }}
      </span>
    </p>
  </div>
</template>
