<script setup lang="ts">
import { Skeleton } from '@/components/ui'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    rows?: number
    showViewAll?: boolean
  }>(),
  {
    title: 'Tickets',
    description: 'Keep track of support requests.',
    rows: 5,
    showViewAll: false,
  },
)
</script>

<template>
  <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <!-- Table heading -->
    <div
      class="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <div class="space-y-2">
        <Skeleton class="h-6 w-32" />
        <Skeleton class="h-4 w-56" />
      </div>

      <Skeleton v-if="showViewAll" class="h-9 w-32 rounded-lg" />
    </div>

    <!-- Table background -->
    <div class="overflow-x-auto bg-slate-100/80 p-3 sm:p-4">
      <table class="w-full min-w-162.5 border-separate border-spacing-y-2">
        <!-- Table header -->
        <thead>
          <tr>
            <th
              v-for="(heading, index) in ['ID', 'Subject', 'Assignee', 'Priority', 'Status']"
              :key="heading"
              class="bg-slate-100 px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-600"
              :class="{
                'w-24 rounded-l-lg': index === 0,
                'rounded-r-lg': index === 4,
              }"
            >
              {{ heading }}
            </th>
          </tr>
        </thead>

        <!-- Skeleton rows -->
        <tbody>
          <tr v-for="row in rows" :key="row" class="bg-white">
            <td
              v-for="column in 5"
              :key="column"
              class="px-5 py-5"
              :class="{
                'rounded-l-xl': column === 1,
                'rounded-r-xl': column === 5,
              }"
            >
              <Skeleton
                :class="{
                  'h-4 w-10': column === 1,
                  'h-4 w-40': column === 2,
                  'h-4 w-24': column === 3,
                  'h-6 w-16 rounded-full': column === 4,
                  'h-6 w-20 rounded-full': column === 5,
                }"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table footer -->
    <div class="border-t border-slate-100 px-6 py-3">
      <Skeleton class="h-3 w-28" />
    </div>
  </section>
</template>
