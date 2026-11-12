<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavigation from '@/components/Layout/AppNavigation.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppNavigation />

    <div class="lg:ml-64">
      <div v-if="authStore.isLoading" class="p-4">Loading user profile...</div>

      <div v-else-if="authStore.profile" class="px-4 py-2 text-sm text-slate-600">
        Welcome, {{ authStore.profile.fullName || 'User' }}!
        <span class="ml-2 capitalize"> ({{ authStore.profile.role }}) </span>
      </div>

      <div v-else-if="authStore.errorMessage" class="p-4 text-sm text-red-600">
        {{ authStore.errorMessage }}
      </div>
    </div>
    <main class="min-w-0 flex-1 lg:ml-64">
      <RouterView />
    </main>
  </div>
</template>
