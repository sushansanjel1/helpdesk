<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Pencil, Camera } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '../ui'
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

const authStore = useAuthStore()

const emit = defineEmits<{
  (event: 'edit-profile'): void
}>()

const userName = computed(() => authStore.profile?.fullName || 'User')

const avatarInput = ref<HTMLInputElement | null>(null)
const selectedImage = ref<File | null>(null)
const showUploadConfirmation = ref(false)

// Open image picker
const openAvatarPicker = () => {
  avatarInput.value?.click()
}

// Handle selected image
const handleAvatarSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  // Validate image type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    toast.error('Please select a PNG, JPEG, or WebP image.')
    input.value = ''
    return
  }

  // Validate image size (2 MB)
  if (file.size > 2 * 1024 * 1024) {
    toast.error('Image size must be less than 2 MB.')
    input.value = ''
    return
  }

  selectedImage.value = file
  showUploadConfirmation.value = true

  //Reset the input so the same image can be selected again if cancelled.
  input.value = ''
}

const confirmImageUpload = async () => {
  if (!selectedImage.value) return

  const file = selectedImage.value
  showUploadConfirmation.value = false

  try {
    await authStore.uploadAvatar(file)
    toast.success('Profile picture updated successfully.')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to upload profile picture.'
    toast.error(message)
  } finally {
    selectedImage.value = null
  }
}

const cancelImageUpload = () => {
  selectedImage.value = null
  showUploadConfirmation.value = false
}
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white p-6">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <!-- Avatar and name -->
      <div class="flex items-center gap-4">
        <!-- Avatar -->
        <div class="relative h-20 w-20 shrink-0">
          <div
            class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xl font-semibold text-blue-700"
          >
            <img
              v-if="authStore.profile?.avatarUrl"
              :src="authStore.profile.avatarUrl"
              :alt="`${userName}'s profile picture`"
              class="h-full w-full object-cover"
            />

            <span v-else>
              {{ userName.charAt(0).toUpperCase() }}
            </span>
          </div>

          <!-- Avatar edit button -->
          <button
            type="button"
            aria-label="Change profile picture"
            title="Change profile picture"
            :disabled="authStore.isUploadingAvatar"
            class="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            @click="openAvatarPicker"
          >
            <Camera v-if="!authStore.isUploadingAvatar" :size="14" />

            <span
              v-else
              class="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
          </button>
        </div>

        <!-- Hidden file input -->
        <input
          ref="avatarInput"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          class="hidden"
          @change="handleAvatarSelected"
        />

        <!-- User information -->
        <div>
          <h2 class="text-lg font-semibold text-slate-900">
            {{ userName }}
          </h2>

          <p class="text-sm capitalize text-slate-500">
            {{ authStore.role }}
          </p>
        </div>
      </div>

      <!-- Edit profile button -->
      <Button class="gap-2" @click="emit('edit-profile')">
        <Pencil :size="16" />
        Edit Profile
      </Button>
    </div>

    <AlertDialog v-model:open="showUploadConfirmation">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Profile Picture?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to upload this image as your new profile picture?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel @click="cancelImageUpload"> Cancel </AlertDialogCancel>

          <AlertDialogAction
            :disabled="authStore.isUploadingAvatar || !selectedImage"
            @click="confirmImageUpload"
          >
            Upload Picture
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
