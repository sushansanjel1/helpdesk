<script setup lang="ts">
import { useTicketStore } from '@/stores/ticket'
import type { Ticket } from '@/types/ticket'

import {
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui'

const ticketStore = useTicketStore()
const tickets = ticketStore.tickets

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
  <div class="mx-auto mt-6 w-full max-w-7xl rounded-lg border bg-background shadow-sm">
    <div class="overflow-x-auto">
      <Table class="min-w-162.5">
        <TableHeader>
          <TableRow>
            <TableHead class="w-24">ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="ticket in tickets" :key="ticket.id">
            <TableCell class="font-medium text-muted-foreground"> #{{ ticket.id }} </TableCell>

            <TableCell class="max-w-[240px] truncate font-medium">
              {{ ticket.subject }}
            </TableCell>

            <TableCell class="max-w-[180px] truncate">
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
            <TableCell colspan="5" class="h-24 text-center text-muted-foreground">
              No tickets found.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
