<script setup lang="ts">
import SupportOverview from '@/components/dashboard/SupportOverview.vue'
import TicketTable from '@/components/dashboard/TicketTable.vue'
</script>

<template>
  <div class="min-h-screen px-4 pb-8 pt-5 sm:px-6 lg:pt-8 lg:px-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <SupportOverview />
      <TicketTable />
    </div>
  </div>
</template>
