<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SupportOverview from '@/components/dashboard/SupportOverview.vue'
import TicketTable from '@/components/tickets/TicketTable.vue'
import TicketTableSkeleton from '@/components/skeleton/TicketTableSkeleton.vue'
import TicketStatusChart from '@/components/dashboard/TicketStatusChart.vue'
import TicketCreationChart from '@/components/dashboard/TicketCreationChart.vue'
import { useTickets } from '@/composable/ticket'
import { useAuthStore } from '@/stores/auth'

const { tickets, fetchTickets, isFetching } = useTickets()
const authStore = useAuthStore()

//Tickets displayed in the charts
const chartTickets = computed(() => {
  const currentUserId = authStore.profile?.id
  const currentRole = authStore.profile?.role

  if (!currentUserId || !currentRole) return []

  if (currentRole === 'customer') {
    return tickets.value.filter((ticket) => ticket.userId === currentUserId)
  }

  if (currentRole === 'admin') {
    return tickets.value.filter((ticket) => ticket.assigneeId === currentUserId)
  }

  if (currentRole === 'manager') {
    return tickets.value
  }

  return []
})

//Latest five tickets displayed in the table
const recentTickets = computed(() => {
  const currentUserId = authStore.profile?.id
  const currentRole = authStore.profile?.role

  if (!currentUserId || !currentRole) return []

  const visibleTickets = tickets.value.filter((ticket) => {
    if (currentRole === 'customer') {
      return ticket.userId === currentUserId
    }

    if (currentRole === 'admin') {
      return ticket.assigneeId === currentUserId
    }

    if (currentRole === 'manager') {
      return ticket.assigneeId !== null
    }

    return false
  })

  const priorityOrder: Record<string, number> = {
    urgent: 1,
    high: 2,
    medium: 3,
    low: 4,
  }

  return visibleTickets
    .sort((a, b) => {
      const priorityDifference =
        (priorityOrder[a.priority.toLowerCase()] ?? 5) -
        (priorityOrder[b.priority.toLowerCase()] ?? 5)

      if (priorityDifference !== 0) return priorityDifference

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    .slice(0, 5)
})

const tableTitle = computed(() => {
  switch (authStore.profile?.role) {
    case 'customer':
      return 'My Recent Tickets'
    case 'admin':
      return 'My Assigned Tickets'
    case 'manager':
      return 'Team Assigned Tickets'
    default:
      return 'Recent Tickets'
  }
})

const tableDescription = computed(() => {
  switch (authStore.profile?.role) {
    case 'customer':
      return 'Your latest 5 support requests, prioritized by urgency.'
    case 'admin':
      return 'Your latest 5 assigned tickets, prioritized by urgency.'
    case 'manager':
      return 'The latest 5 tickets assigned across the support team.'
    default:
      return 'Your latest support tickets.'
  }
})

onMounted(() => {
  fetchTickets()
})
</script>

<template>
  <div class="min-h-screen px-4 pb-8 pt-5 sm:px-6 lg:px-8 lg:pt-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <SupportOverview />

      <!-- Dashboard charts -->
      <div
        v-if="authStore.profile?.role === 'admin' || authStore.profile?.role === 'manager'"
        class="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <TicketStatusChart :tickets="chartTickets" />

        <TicketCreationChart :tickets="chartTickets" />
      </div>

      <!-- Ticket table loading skeleton -->
      <TicketTableSkeleton
        v-if="isFetching"
        :title="tableTitle"
        :description="tableDescription"
        :rows="5"
        show-view-all
      />

      <!-- Actual ticket table -->
      <TicketTable
        v-else
        :tickets="recentTickets"
        :title="tableTitle"
        :description="tableDescription"
        show-view-all
      />
    </div>
  </div>
</template>
