<script setup lang="ts">
import StatCard from './StatCard.vue'
import { computed } from 'vue'
import { useTickets } from '@/composable/ticket.ts'

const { tickets } = useTickets()

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
  <section class="space-y-6">
    <!-- Page heading -->
    <div class="space-y-1">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Support Overview</h1>

      <p class="text-sm text-slate-500 sm:text-base">
        Monitor ticket activity and keep track of your support team's workload.
      </p>
    </div>

    <!-- Statistics cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard process="Assigned" :value="assignedTicketsValue" />
      <StatCard process="InProgress" :value="inProgressTicketsValue" />
      <StatCard process="Urgent" :value="urgentTicketsValue" />
      <StatCard process="Resolved" :value="resolvedTicketsValue" />
    </div>
  </section>
</template>
