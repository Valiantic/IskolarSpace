"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [error, setError]       = useState("");
  const router                = useRouter();

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
    // NOTE: If email confirmations are enabled, data.session might be null.
    if (!data.session) {
      // For development, disable email confirmations in Supabase Auth settings.
      setError("Please check your email to confirm your account. Once confirmed, please sign in.");
      return;
    }

    // 3. With a valid session, insert additional user info into tbl_users.
    const userId = data.user?.id;
    if (userId) {
      const { error: dbError } = await supabase
        .from("tbl_users")
        .insert([{ id: userId, full_name: fullName }]);

      if (dbError) {
        setError("Database Insert Error: " + dbError.message);
        return;
      }
    }

    // 4. Redirect to Dashboard on successful signup.
    router.push("/dashboard");
  };
  
  const showPassword = () => {
    setTogglePassword(!togglePassword);
  }

  const handleNavigation = () => {
    router.push("/login");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
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
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Sign Up
        </button>
       

        <button className="w-full mt-7" onClick={handleNavigation}>Already have an account?</button>

      </form>
    </div>
  );
}
