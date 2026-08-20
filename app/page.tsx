"use client";
import React, { useEffect } from "react";
import { SparklesCore } from "./components/DashboardBlocks/ui/sparkles";
import Link from "next/link";
import { BackgroundProvider, useBackground } from "./contexts/BackgroundContext";
import { Rocket } from "lucide-react";

// COMPONENTS
import About from "./components/LandingBlocks/About";
import AIHighlightCard from "./components/LandingBlocks/AIHighlightCard";
import SpaceFeatureHighlight from "./components/LandingBlocks/SpaceFeatureHighlight";
import NotesFeatureHighlight from "./components/LandingBlocks/NotesFeatureHighlight";
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
      
      <div id="home" className="relative min-h-[100vh] w-full flex flex-col items-center justify-center overflow-hidden pt-20" style={{ backgroundColor }}>
        
        {/* Clean Space Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-black z-0" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0" />

        <div className="relative z-10 flex flex-col items-center px-4 w-full">
          {/* Clean Badge */}
          <div data-aos="fade-up" className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-900/50 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs tracking-wider text-slate-300 uppercase">Your No. 1 AI Powered Task Management App</span>
          </div>

          <h1 
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-center font-bold leading-tight tracking-tight max-w-4xl"
          >
            <span className="block text-5xl sm:text-6xl md:text-8xl text-white">
              IskolarSpace
            </span>
          </h1>
          
          <div className="w-full max-w-4xl h-24 relative flex items-center justify-center mb-6">
            {/* Subtle Divider */}
            <div className="absolute inset-x-20 top-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-slate-700 to-transparent h-px w-3/4 md:w-full opacity-50" />
            
            <div className="absolute inset-0 w-full h-full">
              <SparklesCore
                id="tsparticles"
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={300}
                className="w-full h-full absolute z-0 opacity-50"
                particleColor="#ffffff"
              />
            </div>
          </div>

          <div className="flex gap-4 mb-10 z-10 max-w-2xl" data-aos="fade-up" data-aos-delay="200">
            <h2 className="text-slate-400 text-lg md:text-xl text-center font-medium leading-relaxed">
              Ascend to peak productivity. <span className="text-slate-200">Plan</span> your coursework, <span className="text-slate-200">prioritize</span> deadlines, and <span className="text-slate-200">collaborate</span> seamlessly.
            </h2>
          </div>

          <div className="flex z-10" data-aos="fade-up" data-aos-delay="300">
            <Link href="/login">
              <button className="px-8 py-3 text-sm font-medium text-slate-900 bg-white rounded-md hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-sm">
                Get Started
                <Rocket className="w-4 h-4 text-slate-600" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <section  data-aos="fade-up" className="w-full mt-10 mb-10">
        <About />
      </section>

      <section className="w-full mt-10 mb-10">
        <AIHighlightCard />
      </section>

      <section data-aos="fade-up" className="w-full mt-10 mb-10">
        <SpaceFeatureHighlight />
      </section>

       <section data-aos="fade-up" className="w-full">
        <NotesFeatureHighlight />
      </section>

      <section className="w-full mb-10">
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