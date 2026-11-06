<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { Ticket, CreateTicketInput } from '@/types/ticket'
import { useTickets } from '@/composable/ticket.ts'
import CreateTicketModal from '@/components/tickets/CreateTicketModal.vue'
import TicketFilters from '@/components/tickets/TicketFilters.vue'
import TicketTable from '@/components/dashboard/TicketTable.vue'

//Fetching Tickets from composable(ticket.ts)
const { tickets, addTicket, fetchTickets } = useTickets()

//To hold the current filter values
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')

const totalNoOfTickets = computed(() => tickets.value.length)

const handleSaveTicket = async (ticket: CreateTicketInput): Promise<Ticket | null> => {
  return await addTicket(ticket)
}

const handleFilterChange = (filters: {
  searchQuery: string
  selectedStatus: string
  selectedPriority: string
}) => {
  searchQuery.value = filters.searchQuery
  selectedStatus.value = filters.selectedStatus
  selectedPriority.value = filters.selectedPriority
}

const filteredTickets = computed(() => {
  return tickets.value.filter((ticket) => {
    //Filtering logic
    const query = searchQuery.value.toLowerCase().trim()

    const matchesSearch =
      ticket.subject.toLowerCase().includes(query) || String(ticket.id).includes(query)

    const matchesStatus = selectedStatus.value === '' || ticket.status === selectedStatus.value

    const matchesPriority =
      selectedPriority.value === '' || ticket.priority === selectedPriority.value

    return matchesSearch && matchesStatus && matchesPriority
  })
})

onMounted(() => {
  fetchTickets()
})
</script>

<template>
  <main class="min-h-screen bg-white px-4 pb-10 pt-5 sm:px-6 lg:pt-8 lg:px-8">
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

      <!-- Search and Filters -->
      <section class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <TicketFilters @filter-change="handleFilterChange" />
      </section>

      <!-- Ticket List -->
      <TicketTable
        :tickets="filteredTickets"
        title="All Tickets"
        description="Manage and track your support requests."
      />
    </div>
  </main>
</template>
