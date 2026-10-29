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

<!-- <template>
  <main class="min-h-screen"> -->
<!-- Page Header -->
<!-- <div class="container mx-auto flex items-center justify-between gap-4 bg-white px-10 pt-30">
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
    </section> -->
<!-- Ticket Display Section -->
<!-- <section class="container mx-auto space-y-4 px-10 py-8"> -->
<!-- Empty State -->
<!-- <Card v-if="tickets.length === 0">
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
      </Card> -->

<!-- Ticket List -->
<!-- <Card v-for="ticket in filteredTickets" v-else :key="ticket.id">
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
</template> -->

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
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">All Tickets</h2>

          <p class="text-sm text-slate-500">
            {{ filteredTickets.length }}
            {{ filteredTickets.length === 1 ? 'result' : 'results' }}
          </p>
        </div>

        <!-- No Tickets -->
        <Card v-if="tickets.length === 0" class="border-slate-200 shadow-sm">
          <CardContent class="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <span class="text-xl text-slate-500">+</span>
            </div>

            <h3 class="text-lg font-semibold text-slate-900">No tickets yet</h3>

            <p class="mt-2 max-w-sm text-sm text-slate-500">
              Create your first support ticket to get started.
            </p>
          </CardContent>
        </Card>

        <!-- No Matching Tickets -->
        <Card v-else-if="filteredTickets.length === 0" class="border-slate-200 shadow-sm">
          <CardContent class="flex flex-col items-center justify-center px-6 py-14 text-center">
            <h3 class="text-lg font-semibold text-slate-900">No matching tickets</h3>

            <p class="mt-2 max-w-sm text-sm text-slate-500">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </CardContent>
        </Card>

        <!-- Ticket Cards -->
        <div v-else class="space-y-3">
          <Card
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            class="border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <CardHeader class="pb-3">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div class="min-w-0 space-y-2">
                  <CardTitle
                    class="wrap-break-word text-base font-semibold text-slate-900 sm:text-lg"
                  >
                    {{ ticket.subject }}
                  </CardTitle>

                  <CardDescription class="text-sm text-slate-500">
                    Ticket #{{ ticket.id }}
                  </CardDescription>
                </div>

                <Badge variant="secondary" class="w-fit shrink-0 capitalize">
                  {{ ticket.status.replace('-', ' ') }}
                </Badge>
              </div>
            </CardHeader>

            <CardContent class="space-y-4">
              <p class="wrap-break-word text-sm leading-6 text-slate-600">
                {{ ticket.description }}
              </p>

              <div class="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                <Badge variant="outline" class="border-slate-200 text-slate-600">
                  {{ ticket.category }}
                </Badge>

                <Badge :variant="getPriorityVariant(ticket.priority)" class="capitalize">
                  {{ ticket.priority }} priority
                </Badge>

                <Badge variant="outline" class="border-slate-200 text-slate-600">
                  {{ ticket.type }}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  </main>
</template>
