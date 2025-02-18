"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from 'next/image';
import Logo from '../../public/svgs/iskolarspace_logo.svg';
import StudentCollab from '../../public/images/student_collabs.jpeg';

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
<section className="bg-white">
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
    <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
      <Image
      alt=""
      src={StudentCollab}
      className="absolute inset-0 h-full w-full object-cover"
      />
    </aside>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl">

        <div className="flex"> 

        <h1 className="mt-6 text-2xl font-bold text-black sm:text-xl md:text-4xl">
          Welcome to <span className="font-bold text-sky-500">IskolarSpace</span>
        </h1>
        <Image src={Logo} alt="IskolarSpace Logo" width={50} height={50} />

        </div>

        <p className="mt-4 leading-relaxed text-black">
        Unlock powerful tools to streamline your tasks, boost productivity, and connect with a supportive community. Empower your educational journey with IskolarSpace. Let's get started!
        </p>

        <form onSubmit={handleSignup} className="mt-8 grid grid-cols-6 gap-6">

        {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="col-span-6">
            <label htmlFor="Fullname" className="block text-xl font-medium text-black">
              Fullname
            </label>

            <input
              type="text"
              id="Fullname"
              name="full_name"
              className="mt-1 p-2 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>


          <div className="col-span-6">
            <label htmlFor="Email" className="block text-xl font-medium text-black"> Email </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
               className="mt-1 p-2 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700  shadow-xs"
              required
            />
          </div>

          <div className="col-span-6">
            <label htmlFor="Password" className="block text-xl font-medium text-black"> Password </label>

            <div className="mb-4 relative">

            <input
              type={togglePassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-xs"
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

      

          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button
              className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:ring-3 focus:outline-hidden"
            >
              Create an account
            </button>

            <p onClick={handleNavigation} className="mt-4 text-sm text-blue-600 sm:mt-0">
              Already have an account?&nbsp;
              <a href="#" className="text-black underline">Log in</a>.
            </p>
            
          </div>
        </form>
      </div>
    </main>
  </div>
</section>
  );
}
