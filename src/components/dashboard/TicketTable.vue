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
    subject: 'login Problem',
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

<template>
  <div>
    <table class="w-7xl mx-auto border-2 border-white text-left text-sm mt-6 px-6 py-4">
      <thead class="border-2 border-white bg-gray-50 text-gray-600">
        <tr>
          <th class="px-4 py-3 font-medium">ID</th>
          <th class="px-4 py-3 font-medium">Subject</th>
          <th class="px-4 py-3 font-medium">Customer</th>
          <th class="px-4 py-3 font-medium">Priority</th>
          <th class="px-4 py-3 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr class="hover:bg-red-100 cursor-pointer" v-for="ticket in tickets" :key="ticket.id">
          <td class="px-4 py-3">{{ ticket.id }}</td>
          <td class="px-4 py-3 font-medium">{{ ticket.subject }}</td>
          <td class="px-4 py-3">{{ ticket.customer }}</td>
          <td class="px-4 py-3">{{ ticket.priority }}</td>
          <td class="px-4 py-3">{{ ticket.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
