<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleLogin = () => {
  console.log('Email: ', email.value)
  console.log('Passowrd: ', password.value)
}
</script>

<!-- <template>
  <div>
    <h1>LOGIN PAGE</h1>
    <form action="">
      <input v-model="email" placeholder="jack@gmail.com" />

      <input v-model="password" placeholder="*******" />
    </form>
  </div>
</template> -->

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h1 class="mb-6 text-center text-2xl font-bold text-gray-900">Login</h1>

      <form @submit.prevent="handleLogin">
        <!-- Email Input Section -->
        <div>
          <label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email: </label>
          <input
            id="email"
            name="email"
            type="email"
            v-model="email"
            placeholder="jack@gmail.com"
            class="w-full rounded-md border border-gray-300 px-4 py-2"
            required
          />
        </div>

        <!-- Passoword Input Section  -->
        <div>
          <label for="password" class="mb-1 block text-sm font-medium text-gray-700"
            >Password:
          </label>
          <input
            v-model="password"
            name="password"
            id="password"
            type="password"
            placeholder="*******"
            class="w-full mb-2 rounded-md border border-gray-300 px-4 py-2"
            required
          />
        </div>

        <!-- Login Button  -->

        <button
          type="submit"
          class="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>
