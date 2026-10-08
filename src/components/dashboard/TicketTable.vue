<script setup lang="ts">
import { ref } from 'vue'

const tickets = ref([
  {
    id: 1024,
    subject: 'Payment Failed',
    customer: 'John',
    priority: 'High',
    status: 'Progress',
  },
  {
    id: 1022,
    subject: 'Login Problem',
    customer: 'Mike',
    priority: 'High',
    status: 'Progress',
  },
  {
    id: 1019,
    subject: 'Refund Request',
    customer: 'Anna',
    priority: 'Low',
    status: 'Resolved',
  },
  {
    id: 1019,
    subject: 'Refund Request',
    customer: 'Anna',
    priority: 'Low',
    status: 'Resolved',
  },
  {
    id: 1019,
    subject: 'Refund Request',
    customer: 'Anna',
    priority: 'Low',
    status: 'Resolved',
  },
  {
    id: 1019,
    subject: 'Refund Request',
    customer: 'Anna',
    priority: 'Low',
    status: 'Resolved',
  },
])
</script>

<!-- <template>
  <div>
    <table
      class="w-7xl mx-auto border-2 border-slate-300 text-left text-sm mt-6 px-6 py-4 rounded-lg shadow-md"
    >
      <thead class="border-2 border-slate-300 bg-gray-50 rounded-lg shadow-md">
        <tr>
          <th class="px-4 py-3 font-medium">ID</th>
          <th class="px-4 py-3 font-medium">Subject</th>
          <th class="px-4 py-3 font-medium">Customer</th>
          <th class="px-4 py-3 font-medium">Priority</th>
          <th class="px-4 py-3 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="hover:bg-red-100 cursor-pointer border border-slate-300"
          v-for="ticket in tickets"
          :key="ticket.id"
        >
          <td class="px-4 py-3">{{ ticket.id }}</td>
          <td class="px-4 py-3 font-medium">{{ ticket.subject }}</td>
          <td class="px-4 py-3">{{ ticket.customer }}</td>
          <td class="px-4 py-3">{{ ticket.priority }}</td>
          <td class="px-4 py-3">{{ ticket.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template> -->

<template>
  <div
    class="mx-auto mt-6 w-full max-w-7xl overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm"
  >
    <table class="w-full text-left text-sm">
      <thead class="bg-slate-50 text-slate-600">
        <tr>
          <th class="px-6 py-4 font-semibold">ID</th>
          <th class="px-6 py-4 font-semibold">Subject</th>
          <th class="px-6 py-4 font-semibold">Customer</th>
          <th class="px-6 py-4 font-semibold">Priority</th>
          <th class="px-6 py-4 font-semibold">Status</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-slate-200">
        <tr
          v-for="ticket in tickets"
          :key="ticket.id"
          class="cursor-pointer transition hover:bg-slate-50"
        >
          <td class="px-6 py-4 text-slate-600">#{{ ticket.id }}</td>

          <td class="px-6 py-4 font-medium text-slate-900">
            {{ ticket.subject }}
          </td>

          <td class="px-6 py-4 text-slate-600">
            {{ ticket.customer }}
          </td>

          <td class="px-6 py-4 text-slate-600">
            {{ ticket.priority }}
          </td>

          <td class="px-6 py-4 text-slate-600">
            {{ ticket.status }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
