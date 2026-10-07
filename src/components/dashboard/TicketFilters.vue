<script setup lang="ts">
import { ref } from 'vue'

const selectedStatus = ref('open')
const selectedPriority = ref('low')
</script>

<template>
  <div class="px-6 py-4 flex justify-evenly border-2 border-white">
    <h1>Search Tickets</h1>

    <div>
      <label for="status">Status: </label>
      <select name="status" id="status" v-model="selectedStatus">
        <option value="progress">Progress</option>
        <option value="open">Open</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>

    <div>
      <label for="priority">Priority: </label>
      <select name="priority" id="priority" v-model="selectedPriority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  </div>
</template>
