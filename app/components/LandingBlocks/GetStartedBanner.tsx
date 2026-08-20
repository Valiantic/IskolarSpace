import React from 'react'
import { useEffect } from 'react';
import Link from 'next/link';
import GetStartedPic from '../../../public/images/GetStartedPic.png';

const GetStartedBanner = () => {

  useEffect (() => {
    async function initAOS() {
      const AOS = (await import('aos')).default;
      AOS.init({
        duration: 2000,
        once: true,
      });    }
    
    initAOS();
  });
  
  return (
    <section 
      data-aos="fade-up" 
      className="rounded-md relative"
      style={{ 
        backgroundImage: `url(${GetStartedPic.src})`, 
        backgroundSize: "cover",
        backgroundPosition: "center" 
      }}
    >      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
      ></div>
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center relative z-10">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-4xl text-white font-bold sm:text-4xl font-syncopate tracking-tight">
            Empower your academic journey with 
            <strong className="block text-white mt-1"> IskolarSpace today! </strong>
          </h1>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="block w-full rounded-md bg-white px-12 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-200 transition-colors sm:w-auto">
            Get Started
            </Link>

      </div>
    </div>
  </div>
</section>
  )
}

export default GetStartedBanner
