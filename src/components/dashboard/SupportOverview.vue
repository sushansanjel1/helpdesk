<script setup lang="ts">
import StatCard from './StatCard.vue'
import { computed } from 'vue'
import { useTickets } from '@/composable/ticket.ts'

const { tickets, fetchTickets } = useTickets()
fetchTickets()

const assignedTicketsValue = computed(
  () => tickets.value.filter((ticket) => ticket.assignee !== null).length,
)

const inProgressTicketsValue = computed(
  () => tickets.value.filter((ticket) => ticket.status === 'in-progress').length,
)
const urgentTicketsValue = computed(
  () => tickets.value.filter((ticket) => ticket.priority.toLowerCase() === 'urgent').length,
)
const resolvedTicketsValue = computed(
  () => tickets.value.filter((ticket) => ticket.status === 'resolved').length,
)
</script>

<template>
  <h1 class="px-6">Support Overview</h1>
  <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard process="Assigned" :value="assignedTicketsValue" />
    <StatCard process="InProgress" :value="inProgressTicketsValue" />
    <StatCard process="Urgent" :value="urgentTicketsValue" />
    <StatCard process="Resolved" :value="resolvedTicketsValue" />
  </div>
</template>
