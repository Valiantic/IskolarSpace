import React from 'react'
import { useEffect } from 'react';
import Link from 'next/link';
import GetStartedPic from '../../public/images/GetStartedPic.png';

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
          <h1 className="text-4xl text-white font-extrabold sm:text-4xl shadow-text">
            Empower your academic journey with 
            <strong className="font-extrabold sm:block text-cyan-400"> IskolarSpace today! </strong>
          </h1>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="block w-full rounded-md bg-cyan-600 px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:ring-3 focus:outline-hidden sm:w-auto">
            Join the Mission
            </Link>

      </div>
    </div>
  </div>
</section>
  )
}

export default GetStartedBanner
