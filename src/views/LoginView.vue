<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import { useVuelidate } from '@vuelidate/core'
import { required, email as emailValidator, helpers } from '@vuelidate/validators'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const rules = computed(() => ({
  email: {
    required: helpers.withMessage('Email is required.', required),
    email: helpers.withMessage('Please enter a valid email address.', emailValidator),
  },
  password: {
    required: helpers.withMessage('Password is required.', required),
  },
}))

const v$ = useVuelidate(rules, {
  email,
  password,
})

const handleLogin = async () => {
  errorMessage.value = ''

  const isValid = await v$.value.$validate()

  if (!isValid) return

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
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
              :class="{
                'border-red-500 focus-visible:ring-red-500': v$.email.$error,
              }"
              @blur="v$.email.$touch()"
            />

            <p v-if="v$.email.$error" class="text-xs text-red-500">
              {{ v$.email.$errors[0]?.$message }}
            </p>
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
              :class="{
                'border-red-500 focus-visible:ring-red-500': v$.password.$error,
              }"
              @blur="v$.password.$touch()"
            />

            <p v-if="v$.password.$error" class="text-xs text-red-500">
              {{ v$.password.$errors[0]?.$message }}
            </p>
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
