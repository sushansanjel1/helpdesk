import { supabase } from '@/lib/supabase'
import type { CSRProfile } from '@/types/auth'

export const profileService = {
  /**
   * This is my comment
   * @returns CSR
   */
  async getCSRs(): Promise<CSRProfile[]> {
    const { data, error } = await supabase.rpc('get_csrs')

    if (error) {
      throw new Error(`Failed to fetch CSRs: ${error.message}`)
    }

    return data
  },
}
