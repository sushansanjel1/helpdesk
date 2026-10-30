<script setup lang="ts">
import type { Ticket } from '@/types/ticket'
import { useTickets } from '@/composable/ticket'
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

const { tickets } = useTickets()

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
      return 'destructive'
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
        <h2 class="text-lg font-semibold tracking-tight text-slate-900">Recent Tickets</h2>
        <p class="text-sm text-slate-500">Keep track of the latest support requests.</p>
      </div>

      <RouterLink
        to="/tickets"
        class="inline-flex w-fit items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
      >
        View all tickets
      </RouterLink>
    </div>

    <!-- Responsive table -->
    <div class="overflow-x-auto">
      <Table class="min-w-162.5">
        <TableHeader>
          <TableRow class="bg-slate-50/70 hover:bg-slate-50/70">
            <TableHead
              class="w-24 px-6 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              ID
            </TableHead>
            <TableHead class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Subject
            </TableHead>
            <TableHead class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Assignee
            </TableHead>
            <TableHead class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Priority
            </TableHead>
            <TableHead class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow
            v-for="ticket in tickets"
            :key="ticket.id"
            class="transition-colors hover:bg-slate-50/80"
          >
            <TableCell class="px-6 font-medium text-slate-500"> #{{ ticket.id }} </TableCell>

            <TableCell class="max-w-60 truncate font-medium text-slate-800">
              {{ ticket.subject }}
            </TableCell>

            <TableCell class="max-w-45 truncate text-slate-600">
              {{ ticket.assignee ?? 'Unassigned' }}
            </TableCell>

            <TableCell>
              <Badge :variant="getPriorityVariant(ticket.priority)">
                {{ ticket.priority }}
              </Badge>
            </TableCell>

            <TableCell>
              <Badge :variant="getStatusVariant(ticket.status)">
                {{ ticket.status.replace('-', ' ') }}
              </Badge>
            </TableCell>
          </TableRow>

          <TableRow v-if="tickets.length === 0">
            <TableCell colspan="5" class="h-32 text-center">
              <div class="space-y-1">
                <p class="font-medium text-slate-700">No tickets yet</p>
                <p class="text-sm text-slate-500">New support requests will appear here.</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Table footer -->
    <div class="border-t border-slate-100 px-6 py-3">
      <p class="text-xs text-slate-500">
        {{ tickets.length }} {{ tickets.length === 1 ? 'ticket' : 'tickets' }} displayed
      </p>
    </div>
  </section>
</template>
