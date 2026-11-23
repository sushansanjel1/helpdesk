<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { VueDraggable, type DraggableEvent } from 'vue-draggable-plus'
import type { Ticket } from '@/types/ticket'
import TicketKanbanCard from './TicketKanbanCard.vue'
import { getAvailableStatusActions } from '@/utils/ticketStatus'
import { toast } from 'vue-sonner'

const props = defineProps<{
  tickets: Ticket[]
  updateTicketStatus: (id: number, status: Ticket['status']) => Promise<Ticket | null>
}>()

// Fixed Kanban columns
const boardColumns: {
  status: Ticket['status']
  title: string
  dotClass: string
}[] = [
  { status: 'open', title: 'Open', dotClass: 'bg-slate-400' },
  { status: 'in-progress', title: 'In Progress', dotClass: 'bg-blue-500' },
  { status: 'resolved', title: 'Resolved', dotClass: 'bg-emerald-500' },
  { status: 'closed', title: 'Closed', dotClass: 'bg-slate-600' },
]

// Temporary column lists used by VueDraggable
const columns = ref<Record<Ticket['status'], Ticket[]>>({
  open: [],
  'in-progress': [],
  resolved: [],
  closed: [],
})

const activeDropStatus = ref<Ticket['status'] | null>(null)
const isDropAllowed = ref<boolean | null>(null)
const isUpdating = ref(false)

// Synchronize column lists with the parent ticket data
const syncColumns = (tickets: Ticket[]) => {
  columns.value = {
    open: tickets.filter((ticket) => ticket.status === 'open'),
    'in-progress': tickets.filter((ticket) => ticket.status === 'in-progress'),
    resolved: tickets.filter((ticket) => ticket.status === 'resolved'),
    closed: tickets.filter((ticket) => ticket.status === 'closed'),
  }
}

// Keep the board synchronized when search, filters, or ticket data change
watch(
  () => props.tickets,
  (tickets) => {
    syncColumns(tickets)
  },
  { immediate: true },
)
const handleDragMove = (event: { to: HTMLElement; from: HTMLElement }) => {
  const destinationStatus = event.to.dataset.status as Ticket['status'] | undefined

  const sourceStatus = event.from.dataset.status as Ticket['status'] | undefined

  if (!destinationStatus || !sourceStatus || destinationStatus === sourceStatus) {
    activeDropStatus.value = null
    isDropAllowed.value = null
    return
  }

  activeDropStatus.value = destinationStatus

  isDropAllowed.value = getAvailableStatusActions(sourceStatus).some(
    (action) => action.status === destinationStatus,
  )
}

// Handle the completed drag operation
const handleDragEnd = async (event: DraggableEvent) => {
  activeDropStatus.value = null
  const destinationStatus = event.to.dataset.status as Ticket['status'] | undefined

  const ticketId = Number(event.item.dataset.ticketId)

  // Find the original ticket from the parent's source of truth
  const originalTicket = props.tickets.find((ticket) => ticket.id === ticketId)

  if (!destinationStatus || !originalTicket) {
    await nextTick()
    syncColumns(props.tickets)
    return
  }

  // Ignore drops into the same column
  if (originalTicket.status === destinationStatus) {
    await nextTick()
    syncColumns(props.tickets)
    return
  }

  // Validate the transition using the shared status utility
  const isAllowed = getAvailableStatusActions(originalTicket.status).some(
    (action) => action.status === destinationStatus,
  )

  if (!isAllowed) {
    // Restore the original board after SortableJS finishes updating
    await nextTick()
    syncColumns(props.tickets)

    toast.error('This status transition is not allowed.')
    return
  }

  isUpdating.value = true

  try {
    // Persist the status through the existing composable
    const updatedTicket = await props.updateTicketStatus(originalTicket.id, destinationStatus)

    // Wait for the parent ticket data to update
    await nextTick()

    if (!updatedTicket) {
      syncColumns(props.tickets)
      return
    }

    // Synchronize the board with the updated source of truth
    syncColumns(props.tickets)
  } finally {
    isUpdating.value = false
  }
}
</script>

<template>
  <section class="w-full">
    <!-- Board -->
    <div class="overflow-x-auto px-2 pb-4">
      <div class="flex min-w-max gap-4 xl:w-full">
        <div
          v-for="column in boardColumns"
          :key="column.status"
          class="flex flex-col w-[min(82vw,19rem)] shrink-0 sm:w-72 xl:w-0 xl:min-w-0 xl:flex-1"
        >
          <!-- Column heading -->
          <div class="mb-3 flex items-center justify-between px-1">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full" :class="column.dotClass" />

              <h3 class="text-sm font-semibold text-slate-800">
                {{ column.title }}
              </h3>

              <span
                class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
              >
                {{ columns[column.status].length }}
              </span>
            </div>
          </div>

          <!-- Draggable list and empty state -->
          <div
            class="relative flex-1 rounded-xl transition-all duration-200"
            :class="{
              'ring-2 ring-blue-400 ring-offset-2':
                activeDropStatus === column.status && isDropAllowed === true,
              'ring-2 ring-red-400 ring-offset-2':
                activeDropStatus === column.status && isDropAllowed === false,
            }"
          >
            <VueDraggable
              v-model="columns[column.status]"
              :group="{ name: 'helpdesk-tickets' }"
              :data-status="column.status"
              :disabled="isUpdating"
              :sort="false"
              :animation="200"
              draggable=".kanban-ticket"
              :empty-insert-threshold="80"
              :on-move="handleDragMove"
              ghost-class="kanban-ghost"
              chosen-class="kanban-chosen"
              class="h-full min-h-110 space-y-3 rounded-xl bg-slate-100/80 p-3 pb-28 transition-colors"
              @end="handleDragEnd"
            >
              <div
                v-for="ticket in columns[column.status]"
                :key="ticket.id"
                :data-ticket-id="ticket.id"
                class="kanban-ticket cursor-grab active:cursor-grabbing"
              >
                <TicketKanbanCard :ticket="ticket" />
              </div>
              <!-- Dedicated bottom drop zone -->
              <div
                v-if="columns[column.status].length > 0"
                class="pointer-events-none absolute bottom-3 left-3 right-3 flex h-20 items-center justify-center rounded-lg"
              >
                <!-- <span class="text-xs text-slate-400"> Drop ticket here </span> -->
              </div>
            </VueDraggable>

            <!-- Empty state is outside VueDraggable -->
            <div
              v-if="columns[column.status].length === 0"
              class="pointer-events-none absolute inset-0 flex items-center justify-center px-3"
            >
              <p class="text-center text-xs text-slate-400">No tickets in this column</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-if="isUpdating" class="mt-2 text-xs text-slate-500">Updating ticket status...</p>
  </section>
</template>

<style scoped>
:deep(.kanban-ghost) {
  opacity: 0.35;
}

:deep(.kanban-chosen) {
  cursor: grabbing;
}
</style>
