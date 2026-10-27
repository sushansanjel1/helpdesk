<script setup lang="ts">
import SupportOverview from '@/components/dashboard/SupportOverview.vue'
import TicketTable from '@/components/dashboard/TicketTable.vue'
import AppNavigation from '@/components/Layout/AppNavigation.vue'
</script>

<template>
  <div>
    <AppNavigation />
    <main class="container bg-gray-100 mx-auto px-4 pt-30">
      <SupportOverview />
      <TicketTable />
    </main>
  </div>
</template>
