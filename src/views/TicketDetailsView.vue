<script lang="ts" setup>
import { useRoute, RouterLink } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { Button } from '@/components/ui'
import { useTickets } from '@/composable/ticket/useTickets'
import { useAuthStore } from '@/stores/auth'
import type { Ticket } from '@/types/ticket'
import { useCsrs } from '@/composable/profile'
import { getAvailableStatusActions } from '@/utils/ticketStatus'
import TicketHeader from '@/components/tickets/details/TicketHeader.vue'
import TicketDescription from '@/components/tickets/details/TicketDescription.vue'
import TicketDetailsSidebar from '@/components/tickets/details/TicketDetailsSidebar.vue'

const route = useRoute()
const authStore = useAuthStore()
const {
  tickets,
  isFetching,
  isUpdating,
  isUpdatingSubject,
  updateTicketStatus,
  updateTicketSubject,
  fetchError,
  fetchTickets,
  assignTicket,
  isAssigning,
  isUpdatingDescription,
  updateTicketDescription,
  isUpdatingPriority,
  updateTicketPriority,
  reporterName,
  isFetchingReporterName,
  fetchReporterName,
} = useTickets()

const descriptionEditor = ref<{
  closeEditor: () => void
} | null>(null)

const { csrs, isFetchingCsrs, fetchCsrs } = useCsrs()

//Get ticket ID from the URL
const ticketId = computed(() => Number(route.params.id))

//Find the corresponding ticket
const ticket = computed(() => tickets.value.find((item) => item.id === ticketId.value))

const selectedCsrId = ref('')

//Keep the selected CSR synchronized with the ticket
watch(
  ticket,
  (currentTicket) => {
    selectedCsrId.value = currentTicket?.assigneeId ?? ''
  },
  { immediate: true },
)

watch(
  ticket,
  (currentTicket, previousTicket) => {
    if (currentTicket && currentTicket.id !== previousTicket?.id) {
      fetchReporterName(currentTicket.id)
    }
  },
  { immediate: true },
)
// Assign, reassign, or unassign a ticket
const handleAssignment = async (assigneeId: string | null) => {
  if (!ticket.value) return

  const currentTicket = ticket.value

  const updatedTicket = await assignTicket(currentTicket.id, assigneeId)

  if (updatedTicket) {
    selectedCsrId.value = updatedTicket.assigneeId ?? ''
  } else {
    // Restore the previous selection if the request fails
    selectedCsrId.value = currentTicket.assigneeId ?? ''
  }
}

const availableActions = computed(() => {
  if (!ticket.value || !authStore.canManageTickets) return []

  return getAvailableStatusActions(ticket.value.status)
})

//Update ticket status
const handleStatusChange = async (status: Ticket['status']) => {
  if (!ticket.value) return

  await updateTicketStatus(ticket.value.id, status)
}

const handlePriorityChange = async (priority: Ticket['priority']) => {
  if (!ticket.value) return

  await updateTicketPriority(ticket.value.id, priority)
}

const handleSubjectSave = async (subject: string) => {
  if (!ticket.value) return

  await updateTicketSubject(ticket.value.id, subject)
}

const handleDescriptionSave = async (description: string) => {
  if (!ticket.value) return

  const updatedTicket = await updateTicketDescription(ticket.value.id, description)

  if (updatedTicket) {
    descriptionEditor.value?.closeEditor()
  }
}
//Initial data fetching
onMounted(() => {
  fetchTickets()

  if (authStore.isManager) {
    fetchCsrs()
  }
})
</script>
<template>
  <main class="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl space-y-6">
      <!-- Back navigation -->
      <RouterLink to="/tickets">
        <Button size="sm" class="mb-4"> ← Back to Tickets </Button>
      </RouterLink>

      <!-- Loading and error states -->
      <div v-if="isFetching" class="py-12 text-center text-muted-foreground">
        Loading ticket details...
      </div>

      <div
        v-else-if="fetchError"
        class="rounded-lg border border-destructive/30 p-5 text-sm text-destructive"
      >
        {{ fetchError }}
      </div>

      <div
        v-else-if="!Number.isInteger(ticketId) || ticketId <= 0"
        class="py-12 text-center text-muted-foreground"
      >
        Invalid ticket ID.
      </div>

      <div v-else-if="!ticket" class="py-12 text-center text-muted-foreground">
        Ticket not found.
      </div>

      <!-- Ticket details layout -->
      <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <!-- Main content -->
        <div class="min-w-0">
          <!-- Ticket header -->
          <TicketHeader :ticket="ticket" :is-saving="isUpdatingSubject" @save="handleSubjectSave" />

          <!-- <div class="border-t" /> -->

          <!-- Description -->
          <TicketDescription
            ref="descriptionEditor"
            :description="ticket.description"
            :is-saving="isUpdatingDescription"
            @save="handleDescriptionSave"
          />

          <!-- Attachments and comments will be added here -->
        </div>

        <!-- Right sidebar -->
        <div class="min-w-0 lg:border-l lg:pl-7">
          <TicketDetailsSidebar
            :ticket="ticket"
            :csrs="csrs"
            :is-manager="authStore.isManager"
            :is-admin="authStore.isAdmin"
            :current-user-id="authStore.profile?.id ?? null"
            :can-manage-tickets="authStore.canManageTickets"
            :is-fetching-csrs="isFetchingCsrs"
            :is-assigning="isAssigning"
            :is-updating="isUpdating"
            :is-updating-priority="isUpdatingPriority"
            :available-actions="availableActions"
            :selected-csr-id="selectedCsrId"
            @update:selected-csr-id="selectedCsrId = $event"
            @status-change="handleStatusChange"
            @priority-change="handlePriorityChange"
            @assign="handleAssignment"
            :reporter-name="reporterName"
            :is-fetching-reporter-name="isFetchingReporterName"
          />
        </div>
      </div>
    </div>
  </main>
</template>
