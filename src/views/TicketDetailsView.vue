<script lang="ts" setup>
import { useRoute, RouterLink } from 'vue-router'
import { useTickets } from '@/composable/ticket'
import { Button } from '@/components/ui'
import { computed } from 'vue'

const route = useRoute()

const { tickets, isFetching, errorMessage } = useTickets()

//Get ticket ID from the URL
const ticketId = computed(() => Number(route.params.id))

//Find the corresponding ticket
const ticket = computed(() => tickets.value.find((item) => item.id === ticketId.value))
</script>
<template>
  <main class="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-5xl space-y-6">
      <!-- Back button -->
      <RouterLink to="/tickets">
        <Button variant="outline"> Back to Tickets </Button>
      </RouterLink>

      <!-- Loading -->
      <div v-if="isFetching">Loading ticket details...</div>

      <!-- Error -->
      <div v-else-if="errorMessage">
        {{ errorMessage }}
      </div>

      <!-- Invalid ID -->
      <div v-else-if="!Number.isInteger(ticketId) || ticketId <= 0">Invalid ticket ID.</div>

      <!-- Ticket not found -->
      <div v-else-if="!ticket">Ticket not found.</div>

      <!-- Ticket Details -->
      <div v-else class="space-y-6">
        <section class="rounded-xl border border-slate-200 p-6">
          <p class="text-sm text-slate-500">Ticket #{{ ticket.id }}</p>

          <h1 class="mt-2 text-2xl font-bold text-slate-900">
            {{ ticket.subject }}
          </h1>

          <p class="mt-4 leading-7 text-slate-600">
            {{ ticket.description }}
          </p>
        </section>

        <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl border border-slate-200 p-4">
            <p class="text-sm text-slate-500">Status</p>
            <p class="mt-2 font-semibold capitalize">
              {{ ticket.status.replace('-', ' ') }}
            </p>
          </div>

          <div class="rounded-xl border border-slate-200 p-4">
            <p class="text-sm text-slate-500">Priority</p>
            <p class="mt-2 font-semibold capitalize">
              {{ ticket.priority }}
            </p>
          </div>

          <div class="rounded-xl border border-slate-200 p-4">
            <p class="text-sm text-slate-500">Category</p>
            <p class="mt-2 font-semibold capitalize">
              {{ ticket.category }}
            </p>
          </div>

          <div class="rounded-xl border border-slate-200 p-4">
            <p class="text-sm text-slate-500">Assignee</p>
            <p class="mt-2 font-semibold">
              {{ ticket.assignee ?? 'Unassigned' }}
            </p>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
