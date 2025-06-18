"use client";
import React, { useEffect } from "react";
import { SparklesCore } from "./DashboardBlocks/ui/sparkles";
import Link from "next/link";
import { BackgroundProvider, useBackground } from "../lib/BackgroundContext";

// COMPONENTS
import About from "./LandingBlocks/About";
import { StickyScrollReveal } from "./LandingBlocks/StickyScrollReveal";
import GetStartedBanner from "./LandingBlocks/GetStartedBanner";
import Footer from "./LandingBlocks/Footer";

function PageContent() {
  const { backgroundColor } = useBackground();
  
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
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor }}>
      <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden mt-7" style={{ backgroundColor }}>
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
            background={backgroundColor}
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          <div 
            className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"
            style={{ backgroundColor }}
          ></div>
        </div>

        <div className="flex gap-4 mt-8" data-aos="fade-up">
          <h2 className="text-white text-center">
          Plan. Prioritize. Conquer.
          </h2>
        </div>

        <div className="flex gap-4 mt-8">
          <Link href="/Login">
          <button className="px-8 py-3 text-white border border-sky-500 rounded-full hover:bg-sky-500/20 transition-colors">
            Resume the Mission
          </button>
          </Link>
        </div>
      </div>

      <section className="w-full mt-10 mb-10">
        <About />
      </section>

      <section className="w-full mt-10 mb-10">
        <StickyScrollReveal />
      </section>

      <section className="w-full mt-10 mb-10">
        <GetStartedBanner />
      </section>

     
      <section className="w-full">
      <Footer/>
      </section>

    </div>
  );
}

export default function Page() {
  return (
    <BackgroundProvider>
      <PageContent />
    </BackgroundProvider>
  );
}