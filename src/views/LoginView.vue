<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { supabase } from '@/lib/supabase'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    errorMessage.value = 'Invalid email or password.'
    return
  }

  await router.push('/dashboard')
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
