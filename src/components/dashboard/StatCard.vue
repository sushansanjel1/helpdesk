<script setup lang="ts">
const props = defineProps<{
  process: string
  value: number
}>()
</script>
<template>
  <div class="p-5 bg-white border border-slate-200 rounded-lg shadow-md">
    <p>{{ props.process }}:</p>
    {{ props.value }}
  </div>
</template>
