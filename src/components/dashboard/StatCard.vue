<script setup lang="ts">
const props = defineProps<{
  process: string
  value: number
}>()

// import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
</script>
<!-- <template>
  <Card>
    <CardHeader>
      <CardTitle>{{ props.process }}</CardTitle>
    </CardHeader>
    <CardContent>
      {{ props.value }}
    </CardContent>
  </Card>
</template> -->

<template>
  <div
    class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-sm font-medium text-slate-500">
          {{ process === 'InProgress' ? 'In Progress' : process }}
        </p>

        <p class="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          {{ value }}
        </p>
      </div>

      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
      >
        <span class="text-lg font-semibold">
          {{
            process === 'Assigned'
              ? 'A'
              : process === 'InProgress'
                ? 'P'
                : process === 'Urgent'
                  ? '!'
                  : '✓'
          }}
        </span>
      </div>
    </div>

    <div class="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        class="h-full w-1/3 rounded-full bg-blue-500"
        :class="{
          'w-2/3 bg-amber-500': process === 'Urgent',
          'w-full bg-emerald-500': process === 'Resolved',
        }"
      />
    </div>
  </div>
</template>
