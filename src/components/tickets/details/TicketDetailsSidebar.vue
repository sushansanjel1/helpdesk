<script setup lang="ts">
import type { Ticket, TicketStatusAction } from '@/types/ticket'
import type { CSRProfile } from '@/types/auth'
import { TICKET_PRIORITIES } from '@/constants/ticket'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui'
import { computed } from 'vue'

const props = defineProps<{
  ticket: Ticket
  csrs: CSRProfile[]
  isManager: boolean
  isAdmin: boolean
  currentUserId: string | null
  canManageTickets: boolean
  isFetchingCsrs: boolean
  isAssigning: boolean
  isUpdating: boolean
  isUpdatingPriority: boolean
  availableActions: TicketStatusAction[]
  reporterName?: string | null
  isFetchingReporterName?: boolean
}>()

const emit = defineEmits<{
  'status-change': [status: Ticket['status']]
  assign: [assigneeId: string | null]
  'priority-change': [priority: Ticket['priority']]
}>()

const selectedCsrId = defineModel<string>('selectedCsrId', {
  default: '',
})

// Reuse the same status colors for the selector and read-only badge.
const statusStyles: Record<Ticket['status'], string> = {
  open: 'border-slate-300 bg-slate-100 text-slate-700',
  'in-progress': 'border-blue-400 bg-blue-100 text-blue-800',
  resolved: 'border-emerald-300 bg-emerald-100 text-emerald-800',
  closed: 'border-slate-300 bg-slate-100 text-slate-600',
}

const statusHoverStyles: Record<Ticket['status'], string> = {
  open: 'hover:border-slate-500',
  'in-progress': 'hover:border-blue-600',
  resolved: 'hover:border-emerald-500',
  closed: 'hover:border-slate-500',
}

const statusPanelStyles: Record<Ticket['status'], string> = {
  open: 'bg-slate-50',
  'in-progress': 'bg-blue-50',
  resolved: 'bg-emerald-50',
  closed: 'bg-slate-50',
}

function statusLabel(status: Ticket['status']): string {
  return status.replace('-', ' ')
}

// Emit only transitions offered by the parent for the ticket's current status.
function handleStatusChange(value: unknown) {
  const action = props.availableActions.find(({ status }) => status === value)

  if (action) {
    emit('status-change', action.status)
  }
}

function handlePriorityChange(value: unknown) {
  const priority = TICKET_PRIORITIES.find((option) => option.value === value)

  if (priority && priority.value !== props.ticket.priority) {
    emit('priority-change', priority.value)
  }
}

const canEditPriority = computed(
  () =>
    props.isManager ||
    (props.isAdmin &&
      props.currentUserId !== null &&
      props.ticket.assigneeId === props.currentUserId),
)

// Handle manager assignment and unassignment
function handleAssignmentSelection(value: unknown) {
  if (typeof value !== 'string') return

  if (value === '__unassigned__') {
    emit('assign', null)
    return
  }

  emit('assign', value)
}
</script>

<template>
  <aside class="space-y-4 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
    <!-- Status section -->
    <section
      class="flex min-h-14 items-center rounded-lg p-3"
      :class="statusPanelStyles[ticket.status]"
    >
      <Select
        v-if="canManageTickets && availableActions.length"
        :model-value="ticket.status"
        :disabled="isUpdating"
        @update:model-value="handleStatusChange"
      >
        <SelectTrigger
          :class="[
            'w-fit min-w-36 border px-3 py-1.5 text-sm font-medium capitalize transition-colors',
            statusStyles[ticket.status],
            statusHoverStyles[ticket.status],
          ]"
          :aria-label="isUpdating ? 'Updating status' : 'Ticket status'"
        >
          <SelectValue :placeholder="statusLabel(ticket.status)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="ticket.status" disabled>
            <span
              class="rounded-sm px-2 py-0.5 text-xs font-medium capitalize"
              :class="statusStyles[ticket.status]"
            >
              {{ statusLabel(ticket.status) }}
            </span>
          </SelectItem>
          <SelectItem
            v-for="action in availableActions"
            :key="action.status"
            :value="action.status"
          >
            <span
              class="rounded-sm px-2 py-0.5 text-xs font-medium capitalize"
              :class="statusStyles[action.status]"
            >
              {{ statusLabel(action.status) }}
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <span
        v-else
        class="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium capitalize"
        :class="statusStyles[ticket.status]"
      >
        {{ statusLabel(ticket.status) }}
      </span>
    </section>

    <!-- Details section -->
    <section class="space-y-5">
      <h2 class="text-sm font-semibold text-foreground">Details</h2>

      <!-- Assignee -->
      <div class="space-y-2">
        <p class="text-xs text-muted-foreground">Assignee</p>

        <!-- Manager assignment -->
        <div v-if="isManager">
          <Select
            :model-value="selectedCsrId"
            :disabled="isFetchingCsrs || isAssigning"
            @update:model-value="handleAssignmentSelection"
          >
            <SelectTrigger
              class="h-auto w-full justify-start rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium shadow-none transition-colors hover:border-slate-500 hover:bg-muted/50"
            >
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="__unassigned__"> Unassigned </SelectItem>

              <SelectItem v-for="csr in csrs" :key="csr.id" :value="csr.id">
                {{ csr.full_name || 'Unnamed CSR' }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- CSR assignee display -->
        <div v-else-if="isAdmin">
          <p class="text-sm font-medium text-foreground">
            {{ ticket.assignee ?? 'Unassigned' }}
          </p>
        </div>

        <!-- Customer / read-only view -->
        <p v-else class="text-sm font-medium text-foreground">
          {{ ticket.assignee ?? 'Unassigned' }}
        </p>
      </div>

      <!-- Priority -->
      <div class="space-y-2">
        <p class="text-xs text-muted-foreground">Priority</p>

        <Select
          v-if="canEditPriority"
          :model-value="ticket.priority"
          :disabled="isUpdatingPriority"
          @update:model-value="handlePriorityChange"
        >
          <SelectTrigger
            class="h-auto w-full justify-start rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium capitalize shadow-none transition-colors hover:border-slate-500 hover:bg-muted/50"
            :aria-label="isUpdatingPriority ? 'Updating priority' : 'Ticket priority'"
          >
            <SelectValue :placeholder="ticket.priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="priority in TICKET_PRIORITIES"
              :key="priority.value"
              :value="priority.value"
            >
              {{ priority.label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <p v-else class="text-sm font-medium capitalize text-foreground">
          {{ ticket.priority }}
        </p>
      </div>

      <!-- Reporter -->
      <div class="space-y-2">
        <p class="text-xs text-muted-foreground">Reporter</p>

        <p class="text-sm font-medium text-foreground">
          {{ isFetchingReporterName ? 'Loading...' : reporterName || '—' }}
        </p>
      </div>

      <!-- Ticket metadata -->
      <div class="space-y-2">
        <p class="text-xs text-muted-foreground">Created</p>

        <p class="text-sm font-medium text-foreground">
          {{ new Date(ticket.createdAt).toLocaleDateString() }}
        </p>
      </div>
    </section>
  </aside>
</template>
