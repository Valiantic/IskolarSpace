"use client";
import React, { useEffect } from "react";
import { SparklesCore } from "./components/DashboardBlocks/ui/sparkles";
import Link from "next/link";
import { BackgroundProvider, useBackground } from "../lib/BackgroundContext";
import { Rocket } from "lucide-react";

// COMPONENTS
import About from "./components/LandingBlocks/About";
import { StickyScrollReveal } from "./components/LandingBlocks/StickyScrollReveal";
import GetStartedBanner from "./components/LandingBlocks/GetStartedBanner";
import Footer from "./components/LandingBlocks/Footer";
import Navbar from "./components/LandingBlocks/Navbar";
import ScrollToTop from "./components/LandingBlocks/ScrollToTop";

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
      <Navbar />
      
      <div id="home" className="h-screen w-full flex flex-col items-center justify-center overflow-hidden mt-20 p-4" style={{ backgroundColor }}>
        
        <h1 className="text-2xl font-bold text-white sm:text-lg md:text-4xl lg:text-4xl font-bold text-center mb-4 z-10" data-aos="fade-up">
          Your No. 1 A.I Powered Task Management App
        </h1>

        <h1 
          data-aos="fade-up"
          className="md:text-7xl text-3xl lg:text-9xl font-bold text-center relative z-20 bg-gradient-to-r from-white to-sky-500 text-transparent bg-clip-text z-20"
        >
          IskolarSpace
        </h1>
        <div className="w-[40rem] h-40 relative z-10">
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
          <Link href="/login">
          <button className="px-8 py-3 text-white border border-sky-500 rounded-full hover:bg-sky-500/20 transition-colors">
            Resume the Mission
            <Rocket className="inline ml-2" />
          </button>
          </Link>
        </div>
      </div>

      <section  data-aos="fade-up" className="w-full mt-10 mb-10">
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
      <ScrollToTop />
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