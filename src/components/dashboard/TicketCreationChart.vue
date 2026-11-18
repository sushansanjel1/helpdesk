<script setup lang="ts">
import { computed, ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import type { Ticket } from '@/types/ticket'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const props = defineProps<{
  tickets: Ticket[]
}>()

const selectedRange = ref(7)

const chartData = computed<ChartData<'line'>>(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const labels: string[] = []
  const counts: number[] = []

  for (let i = selectedRange.value - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    const dateLabel = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })

    labels.push(dateLabel)

    const count = props.tickets.filter((ticket) => {
      const ticketDate = new Date(ticket.createdAt)
      ticketDate.setHours(0, 0, 0, 0)

      return ticketDate.getTime() === date.getTime()
    }).length

    counts.push(count)
  }

  return {
    labels,
    datasets: [
      {
        label: 'Tickets Created',
        data: counts,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }
})

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
}
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Tickets Created Over Time</h2>
        <p class="mt-1 text-sm text-slate-500">Track ticket creation activity.</p>
      </div>

      <select
        v-model.number="selectedRange"
        class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
      >
        <option :value="7">Last 7 Days</option>
        <option :value="30">Last 30 Days</option>
        <option :value="90">Last 90 Days</option>
      </select>
    </div>

    <div class="relative h-64">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>
