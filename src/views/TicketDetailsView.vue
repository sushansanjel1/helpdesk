<script lang="ts" setup>
import { useRoute, RouterLink } from 'vue-router'
import { useTickets } from '@/composable/ticket'
import { Button } from '@/components/ui'
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { Ticket } from '@/types/ticket'
import { useCsrs } from '@/composable/profile'

const route = useRoute()

const authStore = useAuthStore()

const {
  tickets,
  isFetching,
  isUpdating,
  updateTicketStatus,
  fetchError,
  fetchTickets,
  assignTicket,
  isAssigning,
} = useTickets()

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

//Assign ticket to the selected CSR.
const handleAssignment = async () => {
  if (!ticket.value || !selectedCsrId.value) return

  await assignTicket(ticket.value.id, selectedCsrId.value)
}

//Available status actions for the current ticket
type StatusAction = {
  label: string
  status: Ticket['status']
}

const availableActions = computed<StatusAction[]>(() => {
  if (!ticket.value || !authStore.canManageTickets) return []

  switch (ticket.value.status) {
    case 'open':
      return [{ label: 'Start Progress', status: 'in-progress' }]

    case 'in-progress':
      return [
        { label: 'Stop Progress', status: 'open' },
        { label: 'Resolve', status: 'resolved' },
      ]

    case 'resolved':
      return [
        { label: 'Reopen', status: 'in-progress' },
        { label: 'Close', status: 'closed' },
      ]

    case 'closed':
      return [{ label: 'Reopen', status: 'open' }]

    default:
      return []
  }
})

//Update ticket status
const handleStatusChange = async (status: Ticket['status']) => {
  if (!ticket.value) return

  await updateTicketStatus(ticket.value.id, status)
}

onMounted(() => {
  fetchTickets()

  if (authStore.isManager) {
    fetchCsrs()
  }
})
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
      <div v-else-if="fetchError">
        {{ fetchError }}
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

        <!-- Ticket Assignment: Manager only -->
        <section v-if="authStore.isManager" class="rounded-xl border border-slate-200 p-6">
          <h2 class="text-lg font-semibold text-slate-900">Manage Ticket Assignment</h2>

          <div class="mt-4 space-y-4">
            <div>
              <label for="csr" class="mb-2 block text-sm font-medium text-slate-700">
                Assign to CSR
              </label>

              <select
                id="csr"
                v-model="selectedCsrId"
                :disabled="isFetchingCsrs || isAssigning"
                class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="" disabled>
                  {{ isFetchingCsrs ? 'Loading CSRs...' : 'Select a CSR' }}
                </option>

                <option v-for="csr in csrs" :key="csr.id" :value="csr.id">
                  {{ csr.full_name || 'Unnamed CSR' }}
                </option>
              </select>
            </div>

            <Button
              :disabled="!selectedCsrId || isAssigning || isFetchingCsrs"
              @click="handleAssignment"
            >
              {{ isAssigning ? 'Assigning...' : 'Assign Ticket' }}
            </Button>
          </div>
        </section>

        <!-- Status Actions: Admin and Manager only -->
        <section v-if="availableActions.length" class="rounded-xl border border-slate-200 p-6">
          <h2 class="text-lg font-semibold text-slate-900">Manage Ticket Status</h2>

          <div class="mt-4 flex flex-wrap gap-3">
            <Button
              v-for="action in availableActions"
              :key="action.status"
              :disabled="isUpdating"
              @click="handleStatusChange(action.status)"
            >
              {{ isUpdating ? 'Updating...' : action.label }}
            </Button>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
