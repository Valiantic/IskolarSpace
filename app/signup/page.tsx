"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { FaEye, FaEyeSlash, FaArrowAltCircleLeft } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/svgs/iskolarspace_logo.svg';
import Signupic from '../../public/images/signupic.png';
import { validateName, validatePassword, validateForm } from "../../lib/validators/signupValidator";


export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [error, setError]       = useState("");
  const router                = useRouter();

  const nameValidation = validateName(fullName);
  const passwordValidation = validatePassword(password);
  const isFormValid = validateForm(fullName, email, password).isValid;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setFullName(value);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 1. Attempt to sign up the user.
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) {
      setError("Signup Error: " + signUpError.message);
      return;
    }

    // 2. Check for a valid session.
    if (!data.session) {
      setError("Please check your email to confirm your account. Once confirmed, please sign in.");
      return;
    }

    // 3. Redirect to Dashboard on successful signup.
    router.push("/dashboard");
  };
  
  const showPassword = () => {
    setTogglePassword(!togglePassword);
  }

  const handleNavigation = () => {
    router.push("/login");
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-5 bg-[#09090b]">
      {/* Left Column - Form */}
      <div className="lg:col-span-2 flex items-center justify-center px-8 lg:px-12 py-12 relative z-10 flex-col bg-[#09090b]">
        <main className="w-full max-w-[420px]">
          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm text-slate-400 hover:text-slate-200 transition-colors">
              <FaArrowAltCircleLeft className="text-lg" /> Back to Home
            </Link>
            
            <div className="flex items-center gap-3 mb-6">
              <Image src={Logo} alt="IskolarSpace Logo" width={40} height={40} />
              <span className="text-xl font-bold text-white font-poppins tracking-tight">IskolarSpace</span>
            </div>
            
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
              Create an account
            </h1>
            <p className="text-sm text-slate-400">
              Sign up to continue to your workspace
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-950/50 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label htmlFor="Fullname" className="block text-sm font-medium text-slate-200">
                  Full Name
                </label>
                <span className="text-xs text-slate-500">{fullName.length}/20</span>
              </div>
              <input
                type="text"
                id="Fullname"
                value={fullName}
                onChange={handleNameChange}
                maxLength={20}
                className={`flex h-12 w-full rounded-lg border bg-[#141416] px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition-all ${!nameValidation.isValid && fullName.length > 20 ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}`}
                placeholder="Jane Doe"
              />
              {!nameValidation.isValid && fullName.length > 20 && (
                <p className="text-red-400 text-xs mt-1">{nameValidation.errors[0]}</p>
              )}
            </div>

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
              <label htmlFor="Password" className="block text-sm font-medium text-slate-200">
                Password
              </label>
              <div className="relative">
                <input
                  type={togglePassword ? "text" : "password"}
                  id="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`flex h-12 w-full rounded-lg border bg-[#141416] hover:border-white/20 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400/20 pr-12 transition-all ${password && !passwordValidation.isValid ? 'border-amber-500/50' : 'border-white/10'}`}
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
              
              {password && !passwordValidation.isValid && (
                <div className="mt-2 p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg">
                  <p className="text-xs text-amber-500 mb-1 font-medium">Password requirements:</p>
                  <ul className="list-disc list-inside">
                  {passwordValidation.errors.map((err, i) => (
                    <li key={i} className="text-amber-400/80 text-xs">{err}</li>
                  ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-white px-4 py-2 text-[15px] font-semibold text-slate-950 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              Sign Up
            </button>

            {/* Login Link */}
            <div className="text-center pt-6">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleNavigation}
                  className="text-white hover:underline font-medium transition-colors ml-1"
                >
                  Log in
                </button>
              </p>
            </div>
          </form>
        </main>
      </div>
      
      {/* Right Column - Image */}
      <div className="hidden lg:block lg:col-span-3 relative w-full h-full bg-[#09090b]">
        <Image
          src={Signupic}
          alt="Signup Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Adds a slight shadow on the inner left edge from the form */}
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#09090b] to-transparent" />
      </div>
    </div>
  );
}
