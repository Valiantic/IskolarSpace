"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useResetPassword } from '../hooks/useResetPassword';
import { supabase } from '../../lib/supabaseClient';
import { Eye, EyeOff, Loader } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../public/svgs/iskolarspace_logo.svg';

export default function ResetPasswordPage() {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    validationError,
    error,
    message,
    loading,
    tokenValid,
    tokenChecked,
    handleSubmit,
    checkTokenValidity
  } = useResetPassword();

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthStateChange = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      
      // Check if this is a password recovery flow
      if (accessToken && refreshToken && type === 'recovery') {
        try {
          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Error setting session:', error);
            router.push('/login');
            return;
          }
          
          // Session set successfully, now validate
          checkTokenValidity(accessToken, type);
        } catch (error) {
          console.error('Error processing reset link:', error);
          router.push('/login');
        }
      } else {
        // Fallback to URL search params (older format)
        const token = searchParams.get('token');
        const searchType = searchParams.get('type');
        
        if (token && searchType === 'recovery') {
          checkTokenValidity(token, searchType);
        } else {
          router.push('/login');
        }
      }
    };

    handleAuthStateChange();
  }, [searchParams, checkTokenValidity, router]);

  // Show loading while checking token
  if (!tokenChecked) {
    return (
      <section className="bg-black min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Loader className="animate-spin text-cyan-400 text-4xl mx-auto mb-4" />
          <p className="text-white">Validating reset token...</p>
        </div>
      </section>
    );
  }

  // Show error if token is invalid
  if (!tokenValid) {
    return (
      <section className="bg-black min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-900/80 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 shadow-2xl shadow-red-500/10">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Image src={Logo} alt="IskolarSpace Logo" width={40} height={40} />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-sky-500 text-transparent bg-clip-text">
                  IskolarSpace
                </h1>
              </div>
              <h2 className="text-xl font-semibold text-red-400 mb-2">
                Access Denied
              </h2>
            </div>
            
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
              <p className="text-red-400 text-sm text-center">
                {error || 'Invalid or expired reset token. Please request a new password reset.'}
              </p>
            </div>
            
            <div className="space-y-3">
              <Link 
                href="/login" 
                className="block w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 text-center"
              >
                Back to Login
              </Link>
              <button
                onClick={() => router.push('/')}
                className="block w-full py-3 px-4 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show the reset form if token is valid
  return (
    <section className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10">
          
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image src={Logo} alt="IskolarSpace Logo" width={40} height={40} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-sky-500 text-transparent bg-clip-text">
                IskolarSpace
              </h1>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Reset Password
            </h2>
            <p className="text-gray-300 text-sm">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Messages */}
            {(error || validationError) && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error || validationError}</p>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm text-center">{message}</p>
              </div>
            )}

            {/* New Password */}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-white mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all pr-12"
                  placeholder="Enter new password"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all pr-12"
                  placeholder="Confirm new password"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-gray-700">
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 underline text-sm transition-colors">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}