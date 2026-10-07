<script setup lang="ts">
import { ref } from 'vue'
const user = ref('Admin')
</script>

<template>
  <div class="flex justify-between gap-10 px-6 py-4 font-bold text-gray-900">
    <div>
      <h1>Logo</h1>
    </div>

    <div>
      <p>User: {{ user }}</p>
    </div>
  </div>
</template>
