<script setup lang="ts">
import { ref, watch } from 'vue'
import type { UserProfile } from '@/types/auth'
import { Button } from '../ui'
import { X, Save } from 'lucide-vue-next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'

const props = defineProps<{
  profile: UserProfile | null
  isEditing: boolean
  isSaving: boolean
}>()

const emit = defineEmits<{
  (event: 'save', data: { fullName: string }): void
  (event: 'cancel'): void
}>()

const fullName = ref('')
const showSaveConfirmation = ref(false)

//Keep form values synchronized with the profile
watch(
  () => [props.profile, props.isEditing],
  () => {
    if (props.profile) {
      fullName.value = props.profile.fullName ?? ''
    }
  },
  { immediate: true },
)

const handleSave = () => {
  showSaveConfirmation.value = true
}

const confirmSave = () => {
  showSaveConfirmation.value = false

  emit('save', {
    fullName: fullName.value.trim(),
  })
}

const handleCancel = () => {
  showSaveConfirmation.value = false
  emit('cancel')
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white p-6">
    <h3 class="mb-5 text-base font-semibold text-slate-900">Personal Information</h3>

    <!-- View mode -->
    <div v-if="!isEditing" class="grid gap-6 sm:grid-cols-2">
      <div>
        <p class="text-sm text-slate-500">Full Name</p>
        <p class="mt-1 font-medium text-slate-900">
          {{ profile?.fullName || 'Not available' }}
        </p>
      </div>

      <div>
        <div class="flex items-center gap-2">
          <p class="text-sm text-slate-500">Email Address</p>
        </div>
        <p class="mt-1 font-medium text-slate-900">
          {{ profile?.email || 'Not available' }}
        </p>
      </div>

      <div>
        <p class="text-sm text-slate-500">Account Role</p>
        <p class="mt-1 font-medium capitalize text-slate-900">
          {{ profile?.role || 'Not available' }}
        </p>
      </div>
    </div>

    <!-- Edit mode -->
    <form v-else class="space-y-5" @submit.prevent="handleSave">
      <div class="space-y-2">
        <label for="fullName" class="text-sm font-medium text-slate-700"> Full Name </label>

        <input
          id="fullName"
          v-model="fullName"
          type="text"
          required
          minlength="2"
          maxlength="100"
          placeholder="Enter your full name"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-slate-700"> Email Address </label>
          <span class="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            Coming Soon
          </span>
        </div>
        <p class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          {{ profile?.email || 'Not available' }}
        </p>
        <p class="text-xs text-slate-500">Email address changes are not available yet.</p>
      </div>

      <div class="flex justify-end gap-3">
        <Button type="button" variant="outline" :disabled="isSaving" @click="handleCancel">
          <X :size="16" class="mr-2" />
          Cancel
        </Button>

        <Button type="submit" :disabled="isSaving">
          <Save :size="16" class="mr-2" />
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </Button>
      </div>
    </form>

    <AlertDialog v-model:open="showSaveConfirmation">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save Profile Changes?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to save your updated profile information?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel :disabled="isSaving"> Go Back </AlertDialogCancel>
          <AlertDialogAction :disabled="isSaving" @click="confirmSave">
            Confirm Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
