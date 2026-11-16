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
      email: user.email ?? null,
      role: data.role as UserRole,
      avatarUrl: data.avatar_url,
    }
  },

  //Update  the user's personal information
  async updateProfile(fullName: string): Promise<void> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('You must be logged in to update your profile.')
    }

    //Update full name in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() })
      .eq('id', user.id)

    if (profileError) {
      throw new Error(`Failed to update profile: ${profileError.message}`)
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

    // Get a safe file extension from the image type
    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    }

    const extension = extensions[file.type]

    if (!extension) {
      throw new Error('Please upload a JPG, PNG, or WebP image.')
    }

    // Generate a unique path for every upload
    const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`

    // Upload the image
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      contentType: file.type,
      cacheControl: '3600',
    })

    if (uploadError) {
      throw new Error(`Failed to upload avatar: ${uploadError.message}`)
    }

    // Get the new image's public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

    const avatarUrl = data.publicUrl

    // Save the new URL to the user's profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id)

    if (updateError) {
      // Remove the uploaded file if saving the profile failed
      await supabase.storage.from('avatars').remove([filePath])

      throw new Error(`Failed to update profile avatar: ${updateError.message}`)
    }

    return avatarUrl
  },
}
