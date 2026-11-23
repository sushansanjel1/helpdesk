<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import type { Ticket } from '@/types/ticket'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  tickets: Ticket[]
}>()

const statusCounts = computed(() => ({
  open: props.tickets.filter((ticket) => ticket.status === 'open').length,
  inProgress: props.tickets.filter((ticket) => ticket.status === 'in-progress').length,
  resolved: props.tickets.filter((ticket) => ticket.status === 'resolved').length,
  closed: props.tickets.filter((ticket) => ticket.status === 'closed').length,
}))

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
  datasets: [
    {
      data: [
        statusCounts.value.open,
        statusCounts.value.inProgress,
        statusCounts.value.resolved,
        statusCounts.value.closed,
      ],
      backgroundColor: ['#3B82F6', '#F59E0B', '#10B981', '#64748B'],
      borderWidth: 0,
      hoverOffset: 6,
    },
  ],
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  cutout: '70%',
}
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="mb-5">
      <h2 class="text-lg font-semibold text-slate-900">Ticket Status Distribution</h2>
      <p class="mt-1 text-sm text-slate-500">Overview of tickets by their current status.</p>
    </div>

    <div v-if="tickets.length === 0" class="flex h-64 items-center justify-center">
      <p class="text-sm text-slate-500">No ticket data available.</p>
    </div>

    <div v-else class="relative h-64">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>
