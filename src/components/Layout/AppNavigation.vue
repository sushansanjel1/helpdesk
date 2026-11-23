<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, Ticket, Users, Menu, X, Headset } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  Button,
} from '../ui'
import { PanelLeft } from 'lucide-vue-next'

const authStore = useAuthStore()
const user = computed(() => authStore.profile?.fullName || 'User')

const router = useRouter()
const isMobileMenuOpen = ref(false)

const props = defineProps<{
  isCollapsed: boolean
}>()

const emit = defineEmits<{
  toggleSidebar: []
}>()

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout failed:', error.message)
    return
  }

  await router.push('/login')
}
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden"
  >
    <button
      class="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"
      aria-label="Open navigation menu"
      @click="isMobileMenuOpen = true"
    >
      <Menu :size="22" />
    </button>
    <div class="flex items-center gap-2">
      <Headset :size="20" class="text-blue-600" />
      <span class="font-semibold tracking-tight text-slate-900">HelpDesk</span>
    </div>
  </header>

  <!-- Mobile backdrop -->
  <button
    v-if="isMobileMenuOpen"
    class="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
    aria-label="Close navigation menu"
    @click="isMobileMenuOpen = false"
  />

  <!-- Sidebar -->
  <aside
    class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-[width,transform] duration-300 ease-in-out lg:translate-x-0"
    :class="[
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
      props.isCollapsed ? 'w-20' : 'w-64',
    ]"
  >
    <!-- Brand -->
    <div
      class="flex h-20 items-center border-b border-slate-100 px-4"
      :class="props.isCollapsed ? 'justify-center' : 'justify-between px-5'"
    >
      <div class="flex items-center gap-3">
        <!-- Logo -->
        <div
          class="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white"
        >
          <!-- Expanded sidebar: Headset always stays visible -->
          <Headset v-if="!props.isCollapsed" :size="23" />

          <!-- Collapsed sidebar: Headset disappears on hover -->
          <Headset
            v-else
            :size="23"
            class="transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0"
          />

          <!-- Expand button: visible only when hovering over collapsed logo -->
          <button
            v-if="props.isCollapsed"
            class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-blue-700 text-white opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100"
            aria-label="Expand sidebar"
            title="Expand sidebar"
            @click="emit('toggleSidebar')"
          >
            <PanelLeft :size="20" />
          </button>
        </div>

        <!-- Brand information -->
        <div v-if="!props.isCollapsed">
          <p class="text-lg font-bold tracking-tight text-slate-900">HelpDesk</p>
          <p class="text-xs text-slate-500">Support workspace</p>
        </div>
      </div>

      <!-- Collapse button: visible when expanded -->
      <button
        v-if="!props.isCollapsed"
        class="hidden rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:block"
        aria-label="Collapse sidebar"
        title="Collapse sidebar"
        @click="emit('toggleSidebar')"
      >
        <PanelLeft :size="20" />
      </button>

      <!-- Mobile close button -->
      <button
        class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        aria-label="Close navigation menu"
        @click="isMobileMenuOpen = false"
      >
        <X :size="20" />
      </button>
    </div>

    <!-- Navigation links -->
    <nav class="flex-1 space-y-2 px-4 py-6">
      <p
        v-if="!props.isCollapsed"
        class="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400"
      >
        Workspace
      </p>

      <RouterLink
        to="/dashboard"
        :title="props.isCollapsed ? 'Dashboard' : undefined"
        class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors"
        active-class="bg-blue-50 text-blue-700"
        :class="[
          props.isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
          $route.path !== '/dashboard'
            ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            : '',
        ]"
        @click="isMobileMenuOpen = false"
      >
        <LayoutDashboard :size="19" />
        <Transition name="sidebar-label">
          <span v-if="!props.isCollapsed">Dashboard</span>
        </Transition>
      </RouterLink>

      <RouterLink
        to="/tickets"
        :title="props.isCollapsed ? 'Tickets' : undefined"
        class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors"
        active-class="bg-blue-50 text-blue-700"
        :class="[
          props.isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
          $route.path !== '/tickets' ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' : '',
        ]"
        @click="isMobileMenuOpen = false"
      >
        <Ticket :size="19" />
        <Transition name="sidebar-label">
          <span v-if="!props.isCollapsed">Tickets</span>
        </Transition>
      </RouterLink>

      <div
        class="flex cursor-not-allowed items-center rounded-lg py-3 text-sm font-medium text-slate-400"
        :class="props.isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'"
        :title="props.isCollapsed ? 'Customers — Coming soon' : undefined"
      >
        <Users :size="19" />
        <template v-if="!props.isCollapsed">
          <span>Customers</span>
          <span class="ml-auto rounded bg-slate-100 px-2 py-0.5 text-[10px]"> Soon </span>
        </template>
      </div>
    </nav>

    <!-- Account section -->
    <div class="border-t border-slate-100 p-4">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            :title="props.isCollapsed ? 'Account settings' : undefined"
            class="flex h-auto w-full items-center rounded-lg py-3 hover:bg-slate-50"
            :class="props.isCollapsed ? 'justify-center px-0' : 'justify-start gap-3 px-3'"
          >
            <!-- Avatar -->
            <span
              class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-semibold text-blue-700"
            >
              <img
                v-if="authStore.profile?.avatarUrl"
                :src="authStore.profile.avatarUrl"
                :alt="`${user}'s profile picture`"
                class="h-full w-full object-cover"
              />

              <span v-else>
                {{ user.charAt(0).toUpperCase() }}
              </span>
            </span>

            <!-- User information -->
            <span v-if="!props.isCollapsed" class="flex flex-1 flex-col items-start">
              <span class="text-sm font-semibold text-slate-800">
                {{ user }}
              </span>
              <span class="text-xs text-slate-500"> Account settings </span>
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem @select="router.push('/account')"> My Account </DropdownMenuItem>

            <DropdownMenuItem @select="handleLogout"> Log Out </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-label-enter-active,
.sidebar-label-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}

.sidebar-label-enter-from,
.sidebar-label-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
