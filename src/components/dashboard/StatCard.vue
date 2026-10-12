<script setup lang="ts">
const props = defineProps<{
  process: string
  value: number
}>()

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
</script>
<template>
  <!-- <div class="p-5 bg-white border border-slate-200 rounded-lg shadow-md">
    <p>{{ props.process }}:</p>
    {{ props.value }}
  </div> -->

  <Card>
    <CardHeader>
      <CardTitle>{{ props.process }}</CardTitle>
    </CardHeader>
    <CardContent>
      {{ props.value }}
    </CardContent>
  </Card>
</template>
