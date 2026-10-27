<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
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

//logout function
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout failed:', error.message)
    return
  }

  await router.push('/login')
}

// onMounted(() => {
//   console.log('navbar mounted')
// })
</script>

<template>
  <header class="flex items-center justify-between bg-gray-800 px-8 py-4 text-white w-full fixed">
    <!-- Left side -->
    <div class="flex items-center gap-8">
      <p class="text-xl font-bold">HelpDesk</p>

      <nav class="flex items-center gap-6">
        <RouterLink to="/dashboard" class="text-lg text-gray-300 transition hover:text-white">
          Dashboard
        </RouterLink>

        <RouterLink to="/tickets" class="text-lg text-gray-300 transition hover:text-white">
          Tickets
        </RouterLink>

        <RouterLink to="" class="text-lg text-gray-300 transition hover:text-white">
          Customers
        </RouterLink>
      </nav>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="outline"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-600"
          >
            {{ user.charAt(0) }}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem @select="handleLogout">Log Out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- <button class="text-lg font-medium">{{ user }}</button> -->
    </div>
  </header>
</template>
