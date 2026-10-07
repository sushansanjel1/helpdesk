<script setup lang="ts">
import { ref } from 'vue'
import StatCard from './StatCard.vue'
const assignedTicketsValue = ref(12)
const inProgressTicketsValue = ref(5)
const urgentTicketsValue = ref(2)
const resolvedTicketsValue = ref(24)
</script>

<template>
  <h1 class="px-6">Support Overview</h1>
  <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard process="Assigned" :value="assignedTicketsValue" />
    <StatCard process="InProgress" :value="inProgressTicketsValue" />
    <StatCard process="Urgent" :value="urgentTicketsValue" />
    <StatCard process="Resolved" :value="resolvedTicketsValue" />
  </div>
</template>
