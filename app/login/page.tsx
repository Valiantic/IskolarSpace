"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { FaEye, FaEyeSlash, FaArrowAltCircleRight } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/svgs/iskolarspace_logo.svg';
import Studying from '../../public/images/Studying.jpeg'

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
<section className="bg-white">
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
    <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
  
      <Image
        alt=""
        src={Studying}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />

      <div className="hidden lg:relative lg:block lg:p-12">

        <div className="flex"> 

        <h1 className="mt-6 text-2xl font-bold text-white sm:text-xl md:text-4xl">
          Welcome to <span className="font-bold text-sky-500">IskolarSpace</span>
        </h1>
        <Image src={Logo} alt="IskolarSpace Logo" width={50} height={50} />

        </div>

        <p className="mt-4 leading-relaxed text-white/90">
        Log in to access your to-do list, manage tasks, and stay on top of your academic responsibilities. Let's continue organizing your journey towards success with IskolarSpace!
        </p>
      </div>
    </section>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl">
        <div className="relative -mt-16 block lg:hidden">
        

          <div className="flex mt-10"> 

          <h1 className="mt-6 text-2xl font-bold text-black sm:text-xl md:text-4xl">
            Welcome to <span className="font-bold text-sky-500">IskolarSpace</span>
          </h1>
          <Image src={Logo} alt="IskolarSpace Logo" width={50} height={50} />

          </div>

          <p className="mt-4 leading-relaxed text-black">
          Log in to access your to-do list, manage tasks, and stay on top of your academic responsibilities. Let's continue organizing your journey towards success with IskolarSpace!
          </p>
        </div>

        <form onSubmit={handleSignin} className="mt-8 grid grid-cols-6 gap-6">
    
          <Link href="/" className="mt-4 text-sm text-blue-600 sm:mt-0 underline gap-2 flex items-center">
              Home <FaArrowAltCircleRight />
          </Link>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          

          <div className="col-span-6">
            <h1 className="text-4xl font-bold mb-2">Login</h1>

            <p className="text-black">Please Login to continue to your account</p>
          </div>


          <div className="col-span-6">
            <label htmlFor="Email" className="block text-xl font-medium text-black"> Email </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full rounded-lg border border-2 border-gray-200 bg-white text-xl text-black shadow-xs"
              required
            />
          </div>

          <div className="col-span-6">
            <label htmlFor="Password" className="block text-xl font-medium text-black"> Password </label>

            <div className="relative">
            <input
              type={togglePassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full rounded-lg border border-2 border-gray-200 bg-white text-xl text-black shadow-xs"
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

         
          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button
              className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:ring-3 focus:outline-hidden"
            >
             Log in
            </button>

            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
             Don't have an account?&nbsp;
              <a onClick={handleNavigation} className="text-black underline cursor">Sign-up</a>.
            </p>

          </div>

        </form>
      </div>
    </main>
  </div>
</section>
  );
}
