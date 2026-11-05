import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { profileService } from '@/services/profileService'
import type { CSRProfile } from '@/services/profileService'

export const useCsrs = () => {
  const csrs = ref<CSRProfile[]>([])
  const isFetchingCsrs = ref(false)

  const fetchCsrs = async (): Promise<void> => {
    isFetchingCsrs.value = true

    try {
      csrs.value = await profileService.getCSRs()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch CSR profiles.'

      toast.error(message)
    } finally {
      isFetchingCsrs.value = false
    }
  }

  return {
    csrs,
    isFetchingCsrs,
    fetchCsrs,
  }
}
