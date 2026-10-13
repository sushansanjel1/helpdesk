<script setup lang="ts">
import { ref } from 'vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = () => {
  console.log('Email: ', email.value)
  console.log('Password: ', password.value)

  if (email.value === 'admin@gmail.com' && password.value === 'admin') {
    console.log('Login successful')
    router.push('/dashboard')
  } else {
    console.log('Invalid email or password')
    errorMessage.value = 'Invalid email or password.'
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-center text-2xl"> Login </CardTitle>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email -->
          <div class="space-y-2">
            <Label for="email">Email</Label>

            <Input
              id="email"
              name="email"
              type="email"
              v-model="email"
              placeholder="jack@gmail.com"
              required
            />
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <Label for="password">Password</Label>

            <Input
              id="password"
              name="password"
              type="password"
              v-model="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <!-- Login Button -->
          <Button type="submit" class="w-full"> Login </Button>
        </form>
        <p v-if="errorMessage" class="text-sm text-destructive">
          {{ errorMessage }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>
