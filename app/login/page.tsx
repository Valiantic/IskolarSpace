"use client";

import { useState } from "react";
import { useAuth } from "../hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaArrowAltCircleRight } from "react-icons/fa";
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
    <section className="bg-black">
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
    <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
  
      <Image
        alt=""
        src={Loginpic}
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />

      <div className="hidden lg:relative lg:block lg:p-12">

        <div className="flex"> 

        <h1 className="mt-6 text-4xl font-bold text-white sm:text-xl md:text-4xl">
          Welcome to <span className="font-bold bg-gradient-to-r from-white to-sky-500 text-transparent bg-clip-text">IskolarSpace</span>
        </h1>
        <Image src={Logo} alt="IskolarSpace Logo" width={50} height={50} />

        </div>

        <p className="mt-4 leading-relaxed text-white/90">
        Where students connect, collaborate, and conquer their academic challenges.
        </p>
      </div>
    </section>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl">
        <div className="relative -mt-16 block lg:hidden mb-8">
          <div className="flex items-center gap-3 mt-10"> 
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome to <span className="font-bold bg-gradient-to-r from-white to-sky-500 text-transparent bg-clip-text">IskolarSpace</span>
            </h1>
            <Image src={Logo} alt="IskolarSpace Logo" width={40} height={40} />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-white">
            Log in to access your to-do list, manage tasks, and stay on top of your academic responsibilities.
          </p>
        </div>
          
        {/* Card Container */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10">
          
          {/* Home Link */}
          <div className="flex justify-end mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white underline hover:text-cyan-400 transition-colors">
              Home <FaArrowAltCircleRight />
            </Link>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-sky-500 text-transparent bg-clip-text">
              Welcome back!
            </h1>
            <p className="mt-4 text-sm text-white">
              Log in to continue managing your tasks and assignments.
            </p>
          </div>

          <form onSubmit={signIn} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="Email" className="block text-lg font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="Password" className="block text-lg font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={togglePassword ? "text" : "password"}
                  id="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button 
                  type="button" 
                  onClick={showPassword} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {togglePassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {/* Forgot Password Link */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-lg text-cyan-400 hover:text-cyan-300 underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? 'Signing in...' : 'Log in'}
            </button>

            {/* Signup Link */}
            <div className="text-center pt-4 border-t border-gray-700">
              <p className="text-gray-300">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={handleNavigation}
                  className="text-cyan-400 hover:text-cyan-300 underline font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</section>

      <ForgotPasswordModal
          isOpen={showForgotModal}
          onClose={() => setShowForgotModal(false)}
      />
    </>
  );
}
