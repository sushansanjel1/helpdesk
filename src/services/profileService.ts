import { supabase } from '@/lib/supabase'

export interface CSRProfile {
  id: string
  full_name: string | null
}

export const profileService = {
  async getCSRs(): Promise<CSRProfile[]> {
    const { data, error } = await supabase.rpc('get_csrs')

    if (error) {
      throw new Error(`Failed to fetch CSRs: ${error.message}`)
    }

    return data
  },
}
