<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavigation from '@/components/Layout/AppNavigation.vue'
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppNavigation />
    <main class="min-w-0 flex-1 lg:ml-64">
      <RouterView />
    </main>
  </div>
</template>
