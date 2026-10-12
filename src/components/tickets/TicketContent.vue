<!-- <script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ticket } from '@/types/ticket.ts'
import CreateTicketModal from './CreateTicketModal.vue'

const tickets = ref<Ticket[]>([])

const totalNoOfTickets = computed(() => tickets.value.length)

const handleTicketCreated = (ticket: Ticket) => {
  tickets.value.unshift(ticket)
}
</script> -->

<!-- <template>
  <main>
    <div class="container mx-auto flex items-center justify-between bg-gray-100 px-10 pt-30">
      <div>
        <h1 class="font-bold text-2xl">Tickets</h1>
        <p>{{ totalNoOfTickets }} {{ totalNoOfTickets > 1 ? 'tickets' : 'ticket' }} in total</p>
      </div>
      <CreateTicketModal @ticket-created="handleTicketCreated" />
    </div> -->

<!-- Ticket Display Section -->
<!-- <section class="container mx-auto px-10 py-8">
      <div v-if="tickets.length === 0" class="rounded-lg border p-8 text-center">
        <h2 class="font-semibold">No tickets yet</h2>
        <p class="mt-2 text-sm text-gray-500">Create a new ticket to see it appear here.</p>
      </div>

      <div v-else class="space-y-4">
        <article
          v-for="ticket in tickets"
          :key="ticket.id"
          class="rounded-lg border bg-white p-5 shadow-sm"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="font-semibold">{{ ticket.subject }}</h2>
              <p class="mt-1 text-sm text-gray-500">Ticket #{{ ticket.id }}</p>
            </div>

            <span class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              {{ ticket.status }}
            </span>
          </div>

          <p class="mt-3 text-sm">{{ ticket.description }}</p>

          <div class="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
            <span class="rounded bg-gray-100 px-2 py-1">
              {{ ticket.category }}
            </span>
            <span class="rounded bg-gray-100 px-2 py-1"> {{ ticket.priority }} priority </span>
            <span class="rounded bg-gray-100 px-2 py-1">
              {{ ticket.type }}
            </span>
          </div>
        </article>
      </div>
    </section>
  </main>
</template> -->

<script setup lang="ts">
import { computed } from 'vue'
import type { Ticket } from '@/types/ticket'
import CreateTicketModal from './CreateTicketModal.vue'

//Pinia Ticket Store
import { useTicketStore } from '@/stores/ticket.ts'
const ticketStore = useTicketStore()
const tickets = ticketStore.tickets

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const totalNoOfTickets = computed(() => tickets.length)

const handleTicketCreated = (ticket: Ticket) => {
  ticketStore.addTicket(ticket)
}

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

      <CreateTicketModal @ticket-created="handleTicketCreated" />
    </div>

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

      <!-- Ticket List -->
      <Card v-for="ticket in tickets" v-else :key="ticket.id">
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
