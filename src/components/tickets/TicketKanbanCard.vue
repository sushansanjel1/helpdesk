<script setup lang="ts">
import type { Ticket } from '@/types/ticket'
import { RouterLink } from 'vue-router'
import { Badge } from '../ui'

defineProps<{
  ticket: Ticket
}>()

//Priority badge styling
const getPriorityVariant = (priority: string) => {
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

//Format ticket creation date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <RouterLink
    :to="{ name: 'ticket-details', params: { id: ticket.id } }"
    class="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
  >
    <!-- Ticket ID and priority -->
    <div class="mb-3 flex items-center justify-between gap-2">
      <span class="text-xs font-medium text-slate-500"> #{{ ticket.id }} </span>

      <Badge :variant="getPriorityVariant(ticket.priority)" class="capitalize">
        {{ ticket.priority }}
      </Badge>
    </div>

    <!-- Ticket subject -->
    <h3 class="mb-3 line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
      {{ ticket.subject }}
    </h3>

    <!-- Category -->
    <div class="mb-3">
      <span
        class="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
      >
        {{ ticket.category }}
      </span>
    </div>

    <!-- Assignee -->
    <div class="flex items-center justify-between gap-2 text-xs text-slate-500">
      <span class="max-w-[65%] truncate">
        {{ ticket.assignee ?? 'Unassigned' }}
      </span>

      <span class="shrink-0">
        {{ formatDate(ticket.createdAt) }}
      </span>
    </div>
  </RouterLink>
</template>
