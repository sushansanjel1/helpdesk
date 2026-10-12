<script setup lang="ts">
const props = defineProps<{
  process: string
  value: number
}>()

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ props.process }}</CardTitle>
    </CardHeader>
    <CardContent>
      {{ props.value }}
    </CardContent>
  </Card>
</template>
