<!-- <script setup lang="ts">
import { ref } from 'vue'

const user = ref('Admin')
</script>

<template>
  <div class="flex justify-evenly py-4 bg-gray-800 text-white font-bold">
    <div class="w-1/2 flex justify-between">
      <p>HelpDesk</p>
      <a href="">Dashboard</a>

      <a href="">Tickets</a>
      <a href="">Customers</a>
    </div>

    <div>
      <p>{{ user }}</p>
    </div>
  </div>
</template> -->
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const user = ref('Admin')
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
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-600">
        {{ user.charAt(0) }}
      </div>

      <p class="text-lg font-medium">{{ user }}</p>
    </div>
  </header>
</template>
