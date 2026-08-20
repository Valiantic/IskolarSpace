"use client";

import { useState } from "react";
import { useAuth } from "../hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaArrowAltCircleRight } from "react-icons/fa";
import { Rocket } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/svgs/iskolarspace_logo.svg';
import Loginpic from '../../public/images/loginpic.png';
import ForgotPasswordModal from "../components/LoginBlocks/ForgotPasswordModal";

export default function LoginPage() {
   const [togglePassword, setTogglePassword] = useState(false);
   const [showForgotModal, setShowForgotModal] = useState(false);
   const router = useRouter();

  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    signIn,
  } = useAuth();

  const showPassword = () => {
    setTogglePassword(!togglePassword);
  }

  const handleNavigation = () => {
    router.push("/signup");
  }

  return (
    <>
      <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-5 bg-[#09090b]">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 flex items-center justify-center px-8 lg:px-12 py-12 relative z-10 flex-col bg-[#09090b]">
          <main className="w-full max-w-[420px]">
            {/* Header */}
            <div className="mb-10">
              <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm text-slate-400 hover:text-slate-200 transition-colors">
                <FaArrowAltCircleRight className="rotate-180" /> Back to Home
              </Link>
              
              <div className="flex items-center gap-3 mb-6">
                <Image src={Logo} alt="IskolarSpace Logo" width={40} height={40} />
                <span className="text-xl font-bold text-white font-poppins tracking-tight">IskolarSpace</span>
              </div>
              
              <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-slate-400">
                Enter your email to sign in to your account
              </p>
            </div>

            <form onSubmit={signIn} className="space-y-5">
              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-950/50 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm font-medium text-center">{error}</p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="Email" className="block text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-12 w-full rounded-lg border border-white/10 bg-[#141416] hover:border-white/20 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="Password" className="block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={togglePassword ? "text" : "password"}
                    id="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-12 w-full rounded-lg border border-white/10 bg-[#141416] hover:border-white/20 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/20 pr-12 transition-all"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={showPassword} 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {togglePassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-white px-4 py-2 text-[15px] font-semibold text-slate-950 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Signup Link */}
              <div className="text-center pt-6">
                <p className="text-slate-400 text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={handleNavigation}
                    className="text-white hover:underline font-medium transition-colors ml-1"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </main>
        </div>
        
        {/* Right Column - Image */}
        <div className="hidden lg:block lg:col-span-3 relative w-full h-full bg-[#09090b]">
          <Image
            src={Loginpic}
            alt="Login Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#09090b] to-transparent" />
        </div>
      </div>

      <ForgotPasswordModal
          isOpen={showForgotModal}
          onClose={() => setShowForgotModal(false)}
      />
    </>
  );
}
