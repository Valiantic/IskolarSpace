"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [error, setError]       = useState("");
  const router                = useRouter();

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Attempt to sign in the user.
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Signin Error: " + signInError.message);
      return;
    }

    // Check if a valid session exists.
    if (!data.session) {
      setError("Signin failed: No session. Ensure your account is confirmed.");
      return;
    }

    // On success, redirect to the Dashboard.
    router.push("/dashboard");
  };

  const showPassword = () => {
    setTogglePassword(!togglePassword);
  }

  const handleNavigation = () => {
    router.push("/signup");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

         <div className="mb-4 relative">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={togglePassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={showPassword} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {togglePassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    </div>
          </div>
        
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Sign In
        </button>

        <button type="button" onClick={handleNavigation} className="w-full mt-4">
          Don&apos;t have an account? Sign Up
        </button>
      </form>
    </div>
  );
}
