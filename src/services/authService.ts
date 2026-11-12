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
      .select('id, full_name, role, avatar_url')
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
      avatarUrl: data.avatar_url,
    }
  },

  // Upload the current user's profile picture
  async uploadAvatar(file: File): Promise<string> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('You must be logged in to upload an avatar.')
    }

    // Determine the file extension
    const extension = file.type.split('/')[1]

    // Store each user's avatar inside their own folder
    const filePath = `${user.id}/avatar.${extension}`

    // Upload the image to Supabase Storage
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    })

    if (uploadError) {
      throw new Error(`Failed to upload avatar: ${uploadError.message}`)
    }

    // Retrieve the public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

    const avatarUrl = data.publicUrl

    // Save the URL in the user's profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id)

    if (updateError) {
      throw new Error(`Failed to update profile avatar: ${updateError.message}`)
    }

    return avatarUrl
  },
}
