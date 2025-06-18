"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { FaEye, FaEyeSlash, FaArrowAltCircleLeft } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../public/svgs/iskolarspace_logo.svg';
// import StudentCollab from '../../public/images/student_collabs.jpeg';
import StudentAstronaut from '../../public/images/student_astronaut.png';
import Signupic from '../../public/images/signupic.png';

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
<section className="bg-black overflow-x-hidden w-full">
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12 w-full overflow-hidden">
    <aside className="relative block h-40 md:h-80 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
      <Image
        alt="Student Astronaut"
        src={Signupic}
        className="absolute inset-0 h-full w-full object-cover md:object-cover"
        priority
      />
    </aside>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl w-full">

          <Link href="/" className="mt-4 text-sm text-white sm:mt-0 underline gap-2 flex items-center bg-gradient-to-r from-white to-sky-500 text-transparent bg-clip-text">
             <FaArrowAltCircleLeft/> Home
          </Link>

        <div className="flex items-center gap-2"> 
          <h1 className="mt-6 text-5xl font-bold text-white sm:text-xl md:text-7xl">
            Welcome to <span className="font-bold bg-gradient-to-r from-white to-sky-500 text-transparent bg-clip-text">IskolarSpace!</span>
          </h1>
          <Image 
            src={Logo} 
            alt="IskolarSpace Logo" 
            className="mt-6 h-16 w-16 sm:h-10 sm:w-10 md:h-28 md:w-28" 
            width={0} 
            height={0} 
          />
        </div>

        <p className="mt-4 leading-relaxed text-white">
         Empower your educational journey with IskolarSpace. Let's get started!
        </p>

        <form onSubmit={handleSignup} className="mt-8 grid grid-cols-6 gap-6">


        {/* Error message with improved mobile display */}
        {error && (
          <div className="col-span-6">
            <p className="text-red-500 mb-4 break-words text-sm sm:text-base">{error}</p>
          </div>
        )}

          <div className="col-span-6">
            <label htmlFor="Fullname" className="block text-xl font-medium text-white">
              What should we call you?
            </label>

            <input
              type="text"
              id="Fullname"
              name="full_name"
              className="mt-1 p-2 w-full rounded-md border-gray-200 bg-white text-xl text-black shadow-xs"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>


          <div className="col-span-6">
            <label htmlFor="Email" className="block text-xl font-medium text-white"> Email </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
               className="mt-1 p-2 w-full rounded-md border-gray-200 bg-white text-xl  text-black  shadow-xs"
              required
            />
          </div>

          <div className="col-span-6">
            <label htmlFor="Password" className="block text-xl font-medium text-white"> Password </label>

            <div className="mb-4 relative">

            <input
              type={togglePassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 w-full rounded-md border-gray-200 bg-white text-xl  text-black shadow-xs"
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

      

          <div className="col-span-6 sm:flex sm:items-center sm:gap-4 sm:justify-end">
            
            <p onClick={handleNavigation} className="mt-4 text-sm text-blue-600 sm:mt-0 bg-gradient-to-r from-white to-sky-500 text-transparent bg-clip-text">
              Already have an account?&nbsp;&nbsp;
              <a href="#" className="text-white underline">Log in</a>.
            </p>

            <button
              className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-gradient-to-r from-white to-sky-500 hover:text-blue-600 focus:ring-3 focus:outline-hidden"
            >
              Create an account
            </button>
            
          </div>
        </form>
      </div>
    </main>
  </div>
</section>
  );
}
