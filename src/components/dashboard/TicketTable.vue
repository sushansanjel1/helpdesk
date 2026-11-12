<script setup lang="ts">
import type { Ticket } from '@/types/ticket'
import { RouterLink } from 'vue-router'
import {
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui'

// Props received from the parent component
defineProps<{
  tickets: Ticket[]
  title?: string
  description?: string
  showViewAll?: boolean
}>()

function getStatusVariant(status: Ticket['status']) {
  switch (status) {
    case 'open':
      return 'secondary'
    case 'in-progress':
      return 'default'
    case 'resolved':
      return 'outline'
    case 'closed':
      return 'secondary'
  }
}

function getPriorityVariant(priority: string) {
  switch (priority.toLowerCase()) {
    case 'urgent':
    case 'high':
      return 'destructive'
    case 'medium':
      return 'default'
    default:
      return 'secondary'
  }
}
</script>

<template>
  <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <!-- Table heading -->
    <div
      class="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <div class="space-y-1">
        <h2 class="text-lg font-semibold tracking-tight text-slate-900">
          {{ title || 'Tickets' }}
        </h2>

        <p class="text-sm text-slate-500">
          {{ description || 'Keep track of support requests.' }}
        </p>
      </div>

      <RouterLink
        v-if="showViewAll"
        to="/tickets"
        class="inline-flex w-fit items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
      >
        View all tickets
      </RouterLink>
    </div>

    <!-- Table background -->
    <div class="overflow-x-auto bg-slate-100/80 p-3 sm:p-4">
      <Table class="min-w-162.5 border-separate border-spacing-y-2">
        <!-- Table header -->
        <TableHeader>
          <TableRow class="border-0 hover:bg-transparent">
            <TableHead
              class="w-24 rounded-l-lg bg-slate-100 px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-600"
            >
              ID
            </TableHead>

            <TableHead
              class="bg-slate-100 px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-600"
            >
              Subject
            </TableHead>

            <TableHead
              class="bg-slate-100 px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-600"
            >
              Assignee
            </TableHead>

            <TableHead
              class="bg-slate-100 px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-600"
            >
              Priority
            </TableHead>

            <TableHead
              class="rounded-r-lg bg-slate-100 px-5 py-4 text-xs font-medium uppercase tracking-wide text-slate-600"
            >
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <!-- Table body -->
        <TableBody>
          <TableRow
            v-for="ticket in tickets"
            :key="ticket.id"
            class="cursor-pointer border-0 bg-white transition-colors hover:bg-slate-50"
            @click="$router.push({ name: 'ticket-details', params: { id: ticket.id } })"
          >
            <TableCell class="rounded-l-xl px-5 py-4 font-medium tabular-nums text-slate-500">
              #{{ ticket.id }}
            </TableCell>

            <TableCell class="max-w-60 truncate px-5 py-4 font-medium text-slate-800">
              {{ ticket.subject }}
            </TableCell>

            <TableCell class="max-w-45 truncate px-5 py-4 text-slate-600">
              {{ ticket.assignee ?? 'Unassigned' }}
            </TableCell>

            <TableCell class="px-5 py-4">
              <Badge :variant="getPriorityVariant(ticket.priority)" class="capitalize">
                {{ ticket.priority }}
              </Badge>
            </TableCell>

            <TableCell class="rounded-r-xl px-5 py-4">
              <Badge :variant="getStatusVariant(ticket.status)" class="capitalize">
                {{ ticket.status.replace('-', ' ') }}
              </Badge>
            </TableCell>
          </TableRow>

          <!-- Empty state -->
          <TableRow v-if="tickets.length === 0" class="border-0 bg-white">
            <TableCell colspan="5" class="rounded-xl py-12 text-center">
              <div class="space-y-1">
                <p class="font-medium text-slate-700">No tickets found</p>
                <p class="text-sm text-slate-500">Tickets will appear here when available.</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Table footer -->
    <div class="border-t border-slate-100 px-6 py-3">
      <p class="text-xs text-slate-500">
        {{ tickets.length }}
        {{ tickets.length === 1 ? 'ticket' : 'tickets' }} displayed
      </p>
    </div>
  </section>
</template>
