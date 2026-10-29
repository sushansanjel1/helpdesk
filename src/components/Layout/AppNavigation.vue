<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, Ticket, Users, Menu, X, Headset } from 'lucide-vue-next'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  Button,
} from '../ui'

const user = ref('Admin')
const router = useRouter()
const isMobileMenuOpen = ref(false)

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
  <!-- Mobile menu button
  <button
    class="fixed left-4 top-4 z-20 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden"
    aria-label="Open navigation menu"
    @click="isMobileMenuOpen = true"
  >
    <Menu :size="22" />
  </button> -->

  <!-- Mobile sticky top bar -->
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
    class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0"
    :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Brand -->
    <div class="flex h-20 items-center justify-between border-b border-slate-100 px-5">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Headset :size="23" />
        </div>

        <div>
          <p class="text-lg font-bold tracking-tight text-slate-900">HelpDesk</p>
          <p class="text-xs text-slate-500">Support workspace</p>
        </div>
      </div>

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
      <p class="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </p>

      <RouterLink
        to="/dashboard"
        class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors"
        active-class="bg-blue-50 text-blue-700"
        :class="{
          'text-slate-600 hover:bg-slate-50 hover:text-slate-900': $route.path !== '/dashboard',
        }"
        @click="isMobileMenuOpen = false"
      >
        <LayoutDashboard :size="19" />
        <span>Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/tickets"
        class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors"
        active-class="bg-blue-50 text-blue-700"
        :class="{
          'text-slate-600 hover:bg-slate-50 hover:text-slate-900': $route.path !== '/tickets',
        }"
        @click="isMobileMenuOpen = false"
      >
        <Ticket :size="19" />
        <span>Tickets</span>
      </RouterLink>

      <div
        class="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-400"
        title="Coming soon"
      >
        <Users :size="19" />
        <span>Customers</span>
        <span class="ml-auto rounded bg-slate-100 px-2 py-0.5 text-[10px]">Soon</span>
      </div>
    </nav>

    <!-- Account section -->
    <div class="border-t border-slate-100 p-4">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            class="flex h-auto w-full items-center justify-start gap-3 rounded-lg px-3 py-3 hover:bg-slate-50"
          >
            <span
              class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700"
            >
              {{ user.charAt(0) }}
            </span>

            <span class="flex flex-1 flex-col items-start">
              <span class="text-sm font-semibold text-slate-800">{{ user }}</span>
              <span class="text-xs text-slate-500">Account settings</span>
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-48">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>

          <DropdownMenuGroup>
            <DropdownMenuItem @select="handleLogout"> Log Out </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </aside>
</template>
