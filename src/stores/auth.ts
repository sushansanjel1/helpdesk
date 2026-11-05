import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { UserProfile } from '@/types/auth'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  //State
  const profile = ref<UserProfile | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const isUploadingAvatar = ref(false)

  //Computed Properties
  const role = computed(() => profile.value?.role ?? null)

  const isAdmin = computed(() => role.value === 'admin')
  const isManager = computed(() => role.value === 'manager')
  const isCustomer = computed(() => role.value === 'customer')

  const canManageTickets = computed(() => isAdmin.value || isManager.value)

  //Actions
  const fetchProfile = async (): Promise<void> => {
    isLoading.value = true
    errorMessage.value = null

    try {
      profile.value = await authService.getCurrentProfile()
    } catch (err: unknown) {
      errorMessage.value = err instanceof Error ? err.message : 'Failed to retrieve user profile.'
      profile.value = null
    } finally {
      isLoading.value = false
    }
  }

  const clearProfile = (): void => {
    profile.value = null
    errorMessage.value = null
  }

  const uploadAvatar = async (file: File): Promise<void> => {
    isUploadingAvatar.value = true

    try {
      const avatarUrl = await authService.uploadAvatar(file)

      if (profile.value) {
        profile.value = {
          ...profile.value,
          avatarUrl,
        }
      }
    } finally {
      isUploadingAvatar.value = false
    }
  }

  return {
    profile,
    role,
    isLoading,
    errorMessage,
    isAdmin,
    isManager,
    isCustomer,
    canManageTickets,
    fetchProfile,
    clearProfile,
    isUploadingAvatar,
    uploadAvatar,
  }
})
