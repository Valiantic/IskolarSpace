"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; 

export default function Home() {

  const router = useRouter();

  const navigateLogin = () => {
    router.push("/login");
  }

  const navigateSignup = () => {
    router.push("/signup");
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to IskolarSpace!
        </h1>

        <button onClick={navigateLogin} className="w-full border border-4 text-bold p-4 rounded-md">Login</button>
        <button onClick={navigateSignup} className="w-full border border-4 text-bold p-4 rounded-md">Signup</button>

      </main>
    </div>
  );
}
