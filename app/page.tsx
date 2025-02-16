"use client";
import React, { useEffect } from "react";
import { SparklesCore } from "./components/ui/sparkles";
import dynamic from "next/dynamic";

export default function Page() {
  useEffect(() => {
    async function initAOS() {
      const AOS = (await import('aos')).default;
      AOS.init({
        duration: 1000,
        once: true,
      });
    }
    
    initAOS();
  }, []);

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      <h1 
        data-aos="fade-up"
        className="md:text-7xl text-3xl lg:text-9xl font-bold text-center relative z-20 bg-gradient-to-r from-white to-sky-500 text-transparent bg-clip-text"
      >
        IskolarSpace
      </h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        <SparklesCore
          id="tsparticles"
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>

     
      <div className="flex gap-4 mt-8" data-aos="fade-up">
        <h2 className="text-white text-center">
        Empower. Manage. Achieve.
        </h2>
      </div>

      <div className="flex gap-4 mt-8">
        <button className="px-6 py-2 text-white border border-sky-500 rounded-full hover:bg-sky-500/20 transition-colors">
          Sign In
        </button>
        <button className="px-6 py-2 text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors">
          Sign Up
        </button>
      </div>

    </div>
  );
}