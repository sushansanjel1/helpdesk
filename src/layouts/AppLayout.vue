<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavigation from '@/components/Layout/AppNavigation.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted, onUnmounted, ref } from 'vue'

const authStore = useAuthStore()

const isSidebarCollapsed = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const handleViewportChange = () => {
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches

  if (!isDesktop) {
    isSidebarCollapsed.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleViewportChange)
  handleViewportChange()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleViewportChange)
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppNavigation :is-collapsed="isSidebarCollapsed" @toggle-sidebar="toggleSidebar" />

    <div
      :class="isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'"
      class="transition-[margin] duration-300 ease-in-out"
    >
      <div v-if="authStore.isLoading" class="p-4">Loading user profile...</div>

      <div v-else-if="authStore.profile" class="px-4 py-2 text-sm text-slate-600">
        Welcome, {{ authStore.profile.fullName || 'User' }}!
        <span class="ml-2 capitalize"> ({{ authStore.profile.role }}) </span>
      </div>

      <div v-else-if="authStore.errorMessage" class="p-4 text-sm text-red-600">
        {{ authStore.errorMessage }}
      </div>
    </div>

    <main
      :class="isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'"
      class="min-w-0 flex-1 transition-[margin] duration-300 ease-in-out"
    >
      <RouterView />
    </main>
  </div>
</template>
