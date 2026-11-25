<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import ProfileHeader from '@/components/account/ProfileHeader.vue'
import ProfileInformation from '@/components/account/ProfileInformation.vue'

const authStore = useAuthStore()
const isEditing = ref(false)

//Handle Profile Updates
const handleProfileUpdate = async (data: { fullName: string }) => {
  try {
    await authStore.updateProfile(data.fullName)

    isEditing.value = false
    toast.success('Profile updated successfully.')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update your profile.'
    toast.error(message)
  }
}
const handleCancel = () => {
  isEditing.value = false
}
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-8 p-6">
    <!-- Page heading -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">My Account</h1>
      <p class="mt-1 text-sm text-slate-500">
        Manage your personal information and account settings.
      </p>
    </div>

    <!-- Profile header -->
    <ProfileHeader @edit-profile="isEditing = true" />

    <!-- Personal information -->
    <ProfileInformation
      :profile="authStore.profile"
      :is-editing="isEditing"
      :is-saving="authStore.isUpdatingProfile"
      @save="handleProfileUpdate"
      @cancel="handleCancel"
    />

    <!-- Account Security -->
    <div class="rounded-xl border border-slate-200 bg-white p-6">
      <h3 class="mb-5 text-base font-semibold text-slate-900">Account Security</h3>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="font-medium text-slate-900">Change Password</p>
          <p class="mt-1 text-sm text-slate-500">
            Password management will be available in a future update.
          </p>
        </div>

        <span class="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          Coming Soon
        </span>
      </div>
    </div>
  </div>
</template>
