<script setup lang="ts">
import { computed, ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@/components/ui'
import type { Ticket } from '@/types/ticket'
import { useTickets } from '@/composable/ticket.ts'
import CreateTicketModal from '@/components/tickets/CreateTicketModal.vue'
import TicketFilters from '@/components/tickets/TicketFilters.vue'

//Fetching Tickets from composable(ticket.ts)
const { tickets, addTicket, fetchTickets } = useTickets()
fetchTickets()

//To hold the current filter values
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')

const totalNoOfTickets = computed(() => tickets.value.length)

const handleSaveTicket = async (ticket: Ticket): Promise<Ticket | null> => {
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

const getPriorityVariant = (priority: string) => {
  if (priority === 'urgent' || priority === 'high') {
    return 'destructive'
  }

  if (priority === 'medium') {
    return 'secondary'
  }

  return 'outline'
}
</script>

<template>
  <main class="min-h-screen">
    <!-- Page Header -->
    <div class="container mx-auto flex items-center justify-between gap-4 bg-gray-100 px-10 pt-30">
      <div>
        <h1 class="text-2xl font-bold">Tickets</h1>
        <p class="text-sm text-muted-foreground">
          {{ totalNoOfTickets }}
          {{ totalNoOfTickets === 1 ? 'ticket' : 'tickets' }} in total
        </p>
      </div>

      <CreateTicketModal :save-ticket="handleSaveTicket" />
    </div>
    <section class="container mx-auto space-y-4 px-10 py-8">
      <TicketFilters @filter-change="handleFilterChange" />
    </section>
    <!-- Ticket Display Section -->
    <section class="container mx-auto space-y-4 px-10 py-8">
      <!-- Empty State -->
      <Card v-if="tickets.length === 0">
        <CardContent class="flex flex-col items-center justify-center py-12 text-center">
          <h2 class="text-lg font-semibold">No tickets yet</h2>
          <p class="mt-2 text-sm text-muted-foreground">
            Create a new ticket to see it appear here.
          </p>
        </CardContent>
      </Card>
      <Card v-else-if="filteredTickets.length === 0">
        <CardContent class="flex flex-col items-center justify-center py-12 text-center">
          <h2 class="text-lg font-semibold">No matching tickets</h2>
          <p class="mt-2 text-sm text-muted-foreground">Try changing your search or filters.</p>
        </CardContent>
      </Card>

      <!-- Ticket List -->
      <Card v-for="ticket in filteredTickets" v-else :key="ticket.id">
        <CardHeader>
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <CardTitle class="text-base">
                {{ ticket.subject }}
              </CardTitle>
              <CardDescription> Ticket #{{ ticket.id }} </CardDescription>
            </div>

            <Badge variant="secondary">
              {{ ticket.status }}
            </Badge>
          </div>
        </CardHeader>

        <CardContent class="space-y-4">
          <p class="text-sm leading-relaxed">
            {{ ticket.description }}
          </p>

          <div class="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {{ ticket.category }}
            </Badge>

            <Badge :variant="getPriorityVariant(ticket.priority)">
              {{ ticket.priority }} priority
            </Badge>

            <Badge variant="outline">
              {{ ticket.type }}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </section>
  </main>
</template>
