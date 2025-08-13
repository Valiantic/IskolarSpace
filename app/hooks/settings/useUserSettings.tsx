import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../auth/useAuth'

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
}

export const useUserSettings = () => {
  const { user, isAuthenticated } = useAuth()
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // UI states
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch user profile data
  const fetchProfile = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Get user data from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }

      // If no profile exists, create one
      if (!profileData) {
        const { data: newProfileData, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            avatar_url: null
          })
          .select()
          .single()

        if (createError) throw createError
        setProfile(newProfileData)
      } else {
        setProfile(profileData)
      }

      // Set form values
      setFullName(profileData?.full_name || user.user_metadata?.full_name || '')
      setEmail(user.email || '')

    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  // Handle profile picture upload
  const uploadProfilePicture = async (file: File): Promise<boolean> => {
    try {
      setUploading(true)
      setError('')

      console.log('Starting upload process...')
      console.log('File details:', { name: file.name, type: file.type, size: file.size })

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return false
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return false
      }

      if (!user?.id) {
        setError('User not authenticated')
        return false
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = fileName // Remove 'avatars/' prefix since we're specifying the bucket

      // Delete any existing avatar for this user first
      try {
        const { data: existingFiles } = await supabase.storage
          .from('avatars')
          .list('', { 
            limit: 100,
            search: user.id 
          })

        if (existingFiles) {
          for (const existingFile of existingFiles) {
            if (existingFile.name.startsWith(user.id)) {
              await supabase.storage
                .from('avatars')
                .remove([existingFile.name])
            }
          }
        }
      } catch (cleanupError) {
        console.warn('Could not cleanup existing files:', cleanupError)
      }

      // Upload image to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          cacheControl: '3600',
          upsert: true 
        })

      console.log('Upload result:', { data: uploadData, error: uploadError })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      console.log('Public URL:', publicUrl)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        throw new Error(`Profile update failed: ${updateError.message}`)
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null)
      setSuccess('Profile picture updated successfully!')
      return true

    } catch (error: any) {
      console.error('Error uploading image:', error)
      setError(error.message || 'Failed to upload image. Please try again.')
      return false
    } finally {
      setUploading(false)
    }
  }

  // Handle profile update
  const updateProfile = async (): Promise<boolean> => {
    try {
      setSaving(true)
      setError('')

      let emailChanged = false;
      // Update email via Supabase Auth if changed
      if (email !== profile?.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email })
        if (emailError) throw emailError
        emailChanged = true;
      }

      // Update full name in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          full_name: fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id)

      if (profileError) throw profileError

      // Optionally update full name in tbl_users if needed
      const { error: userError } = await supabase
        .from('tbl_users')
        .update({ full_name: fullName })
        .eq('id', user?.id)

      if (userError) throw userError

      // Optionally update auth metadata (not email)
      const { error: metaError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })
      if (metaError) throw metaError

      if (emailChanged) {
        setSuccess('Profile updated! Please check your new email to confirm the change. Your email will update after confirmation.');
      } else {
        setSuccess('Profile updated successfully!');
      }
      return true
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setError(error.message || 'Failed to update profile. Please try again.')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Handle password change
  const updatePassword = async (): Promise<boolean> => {
    try {
      setSaving(true)
      setError('')

      // Validate passwords
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters long')
        return false
      }

      if (newPassword !== confirmPassword) {
        setError('New passwords do not match')
        return false
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setSuccess('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      return true

    } catch (error) {
      console.error('Error updating password:', error)
      setError('Failed to update password. Please try again.')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Clear messages
  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  // Initialize on mount
  useEffect(() => {
    if (user && isAuthenticated) {
      fetchProfile()
    }
  }, [user, isAuthenticated])

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  return {
    // State
    profile,
    loading,
    uploading,
    saving,
    error,
    success,
    
    // Form data
    fullName,
    setFullName,
    email,
    setEmail,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    
    // Actions
    fetchProfile,
    uploadProfilePicture,
    updateProfile,
    updatePassword,
    clearMessages
  }
}
