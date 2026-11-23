<script setup lang="ts">
import { Skeleton } from '@/components/ui'

const columns = [
  { title: 'Open', count: 2 },
  { title: 'In Progress', count: 3 },
  { title: 'Resolved', count: 1 },
  { title: 'Closed', count: 2 },
]
</script>

<template>
  <section class="w-full">
    <div class="overflow-x-auto px-2 pb-4">
      <div class="flex min-w-max gap-4 xl:w-full">
        <!-- Kanban columns -->
        <div
          v-for="column in columns"
          :key="column.title"
          class="flex w-[min(82vw,19rem)] shrink-0 flex-col sm:w-72 xl:w-0 xl:min-w-0 xl:flex-1"
        >
          <!-- Column heading -->
          <div class="mb-3 flex items-center justify-between px-1">
            <div class="flex items-center gap-2">
              <Skeleton class="h-2.5 w-2.5 rounded-full" />
              <Skeleton class="h-4 w-20" />
              <Skeleton class="h-5 w-7 rounded-full" />
            </div>
          </div>

          <!-- Column drop area -->
          <div class="min-h-110 flex-1 space-y-3 rounded-xl bg-slate-100/80 p-3 pb-28">
            <!-- Skeleton ticket cards -->
            <div
              v-for="card in column.count"
              :key="card"
              class="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <!-- Ticket ID and priority -->
              <div class="flex items-center justify-between">
                <Skeleton class="h-3 w-12" />
                <Skeleton class="h-5 w-16 rounded-full" />
              </div>

              <!-- Ticket subject -->
              <div class="space-y-2">
                <Skeleton class="h-4 w-4/5" />
                <Skeleton class="h-3 w-full" />
                <Skeleton class="h-3 w-2/3" />
              </div>

              <!-- Ticket metadata -->
              <div class="flex items-center justify-between border-t border-slate-100 pt-3">
                <div class="flex items-center gap-2">
                  <Skeleton class="h-7 w-7 rounded-full" />
                  <Skeleton class="h-3 w-16" />
                </div>

                <Skeleton class="h-3 w-14" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
