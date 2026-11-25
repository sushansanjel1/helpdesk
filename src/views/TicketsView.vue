<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { Ticket, CreateTicketInput } from '@/types/ticket'
import { useTickets } from '@/composable/ticket/useTickets'
import { useAuthStore } from '@/stores/auth'
import CreateTicketModal from '@/components/tickets/CreateTicketModal.vue'
import TicketFilters from '@/components/tickets/TicketFilters.vue'
import TicketTable from '@/components/tickets/TicketTable.vue'
import TicketKanbanBoard from '@/components/tickets/TicketKanbanBoard.vue'
import TicketTableSkeleton from '@/components/skeleton/TicketTableSkeleton.vue'
import TicketKanbanSkeleton from '@/components/skeleton/TicketKanbanSkeleton.vue'

// Stores and composables
const authStore = useAuthStore()

const { tickets, addTicket, fetchTickets, updateTicketStatus, isFetching } = useTickets()

// View selection
type ViewMode = 'kanban' | 'table'

const viewMode = ref<ViewMode>('kanban')

// Customers always use the table.
// Admin (CSR) and Manager can switch between views.
const activeView = computed<ViewMode>(() => {
  return authStore.canManageTickets ? viewMode.value : 'table'
})

// Filter values
const searchQuery = ref('')
const selectedStatus = ref<string[]>([])
const selectedPriority = ref<string[]>([])

const totalNoOfTickets = computed(() => tickets.value.length)

// Ticket creation
const handleSaveTicket = async (ticket: CreateTicketInput): Promise<Ticket | null> => {
  return await addTicket(ticket)
}

// Receive filter changes
const handleFilterChange = (filters: {
  searchQuery: string
  selectedStatus: string[]
  selectedPriority: string[]
}) => {
  searchQuery.value = filters.searchQuery
  selectedStatus.value = filters.selectedStatus
  selectedPriority.value = filters.selectedPriority
}

// Common filtering: Search + Priority
const searchedAndPriorityFilteredTickets = computed(() => {
  return tickets.value.filter((ticket) => {
    const query = searchQuery.value.toLowerCase().trim()

    const matchesSearch =
      ticket.subject.toLowerCase().includes(query) || String(ticket.id).includes(query)

    const matchesPriority =
      selectedPriority.value.length === 0 || selectedPriority.value.includes(ticket.priority)

    return matchesSearch && matchesPriority
  })
})

// Table filtering: Search + Priority + Status
const tableFilteredTickets = computed(() => {
  return searchedAndPriorityFilteredTickets.value.filter((ticket) => {
    const matchesStatus =
      selectedStatus.value.length === 0 || selectedStatus.value.includes(ticket.status)

    return matchesStatus
  })
})

// Fetch tickets
onMounted(() => {
  fetchTickets()
})
</script>

<template>
  <main class="min-h-screen bg-white px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pt-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <!-- Page Header -->
      <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Tickets</h1>

          <p class="text-sm text-slate-500">
            Manage and track your support requests.

            <span class="font-medium text-slate-700">
              {{ totalNoOfTickets }}
              {{ totalNoOfTickets === 1 ? 'ticket' : 'tickets' }} in total
            </span>
          </p>
        </div>

        <CreateTicketModal :save-ticket="handleSaveTicket" />
      </header>

      <!-- View Toggle: Admin and Manager only -->
      <div v-if="authStore.canManageTickets" class="flex items-center justify-end">
        <div
          class="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1"
          role="group"
          aria-label="Choose ticket view"
        >
          <button
            type="button"
            @click="viewMode = 'kanban'"
            :aria-pressed="activeView === 'kanban'"
            :class="
              activeView === 'kanban'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            "
            class="rounded-md px-4 py-2 text-sm font-medium transition"
          >
            Kanban
          </button>

          <button
            type="button"
            @click="viewMode = 'table'"
            :aria-pressed="activeView === 'table'"
            :class="
              activeView === 'table'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            "
            class="rounded-md px-4 py-2 text-sm font-medium transition"
          >
            Table
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <section class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <TicketFilters
          :filtered-count="
            activeView === 'kanban'
              ? searchedAndPriorityFilteredTickets.length
              : tableFilteredTickets.length
          "
          :total-count="totalNoOfTickets"
          :show-status-filter="activeView === 'table'"
          @filter-change="handleFilterChange"
        />
      </section>

      <!-- Kanban Board -->
      <!-- Kanban Loading Skeleton -->
      <TicketKanbanSkeleton v-if="activeView === 'kanban' && isFetching" />

      <!-- Actual Kanban Board -->
      <TicketKanbanBoard
        v-else-if="activeView === 'kanban'"
        :tickets="searchedAndPriorityFilteredTickets"
        :update-ticket-status="updateTicketStatus"
      />

      <!-- Table View Loading Skeleton -->
      <TicketTableSkeleton
        v-else-if="isFetching"
        title="All Tickets"
        description="Manage and track your support requests."
        :rows="8"
      />

      <!-- Table View -->
      <TicketTable
        v-else
        :tickets="tableFilteredTickets"
        title="All Tickets"
        description="Manage and track your support requests."
      />
    </div>
  </main>
</template>
