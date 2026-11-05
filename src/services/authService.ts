import { supabase } from '@/lib/supabase'
import type { UserProfile, UserRole } from '@/types/auth'

export const authService = {
  //Retrieve the currently authenticated user's profile
  async getCurrentProfile(): Promise<UserProfile | null> {
    //First get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw new Error(`Authentication failed: ${userError.message}`)
    }

    //No authenticated user
    if (!user) {
      return null
    }

    //Retrieve the user's profile
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', user.id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`)
    }

    //Convert database fields to TypeScript properties
    return {
      id: data.id,
      fullName: data.full_name,
      role: data.role as UserRole,
    }
  },
}
