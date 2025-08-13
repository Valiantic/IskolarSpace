'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/auth/useAuth'
import { useUserSettings } from '../hooks/settings/useUserSettings'
import Image from 'next/image'
import { Camera, User, Mail, Lock, Save, X, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '../components/DashboardBlocks/LoadingSpinner'
import UserAvatar from '../../public/images/user_avatar.png'
import Sidebar from '../components/DashboardBlocks/Sidebar'
import SpaceBackground from '../components/DashboardBlocks/SpaceBackground'

export default function SettingsPage() {
  const { isAuthenticated, authLoading } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Custom hook for settings
  const {
    profile,
    loading,
    uploading,
    saving,
    error,
    success,
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
    uploadProfilePicture,
    updateProfile,
    updatePassword,
    clearMessages
  } = useUserSettings()

  const { logout } = useAuth()

  // UI states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeSection, setActiveSection] = useState<'profile' | 'account' | 'password'>('profile')

  // Provide user full name for Sidebar
  const userFullName = profile?.full_name || fullName || '';
  

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      await uploadProfilePicture(file)
    }
  }

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Sidebar 
        userFullName={userFullName}
        handleLogout={logout}
        activePage="settings"
      />
          <div className="flex justify-center items-center">
      <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8 w-full max-w-4xl">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-red-400">{error}</p>
                <button onClick={clearMessages}>
                  <X size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-green-400">{success}</p>
                <button onClick={clearMessages}>
                  <X size={16} className="text-green-400" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveSection('profile')}
              className={`flex-1 px-4 py-2 text-white text-sm font-medium rounded-md transition-all ${
                activeSection === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'text-white hover:text-white hover:bg-slate-700'
              }`}
            >
              Profile Picture
            </button>
            <button
              onClick={() => setActiveSection('account')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeSection === 'account'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Account Info
            </button>
            <button
              onClick={() => setActiveSection('password')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeSection === 'password'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Password
            </button>
          </div>

          {/* Content Sections */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            {/* ...existing code for profile, account, and password sections... */}
            {/* Profile Picture Section */}
            {activeSection === 'profile' && (
              <div className="p-6 sm:p-8">
                {loading ? (
                  <div className="flex items-center justify-center min-h-[200px]">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400/30">
                        <Image
                          src={profile?.avatar_url || UserAvatar}
                          alt="Profile Picture"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-full transition-colors"
                      >
                        {uploading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Camera size={20} />
                        )}
                      </button>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl text-white font-semibold mb-2">Profile Picture</h3>
                      <p className="text-white text-sm max-w-md">
                        Upload a new profile picture. Image should be at least 200x200 pixels and no larger than 5MB.
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            )}
            {/* Account Information Section */}
            {activeSection === 'account' && (
              <div className="p-6 sm:p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl text-white font-semibold mb-6">Account Information</h3>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <User size={16} className="inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        maxLength={50}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Mail size={16} className="inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={updateProfile}
                      disabled={saving}
                      className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors"
                    >
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      ) : (
                        <Save size={16} className="mr-2" />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Password Section */}
            {activeSection === 'password' && (
              <div className="p-6 sm:p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl text-white font-semibold mb-2">Change Password</h3>
                    <p className="text-slate-400 text-sm">
                      Update your password to keep your account secure.
                    </p>
                  </div>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Lock size={16} className="inline mr-2" />
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Lock size={16} className="inline mr-2" />
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Lock size={16} className="inline mr-2" />
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={updatePassword}
                      disabled={saving || !newPassword || !confirmPassword}
                      className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors"
                    >
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      ) : (
                        <Save size={16} className="mr-2" />
                      )}
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
