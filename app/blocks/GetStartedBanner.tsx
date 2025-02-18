import React from 'react'
import { useEffect } from 'react';

const GetStartedBanner = () => {

  useEffect (() => {
    async function initAOS() {
      const AOS = (await import('aos')).default;
      AOS.init({
        duration: 2000,
        once: true,
      });
    }
    
    initAOS();
  })

  return (
    <section data-aos="fade-up" className='bg-gradient-to-r from-white to-sky-500 rounded-md'>
  <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
    <div className="mx-auto max-w-xl text-center">
      <h1 className="text-3xl text-gray-900 font-extrabold sm:text-4xl">
        Empower your academic journey with 
        <strong className="font-extrabold sm:block text-zinc-50"> IskolarSpace today! </strong>
      </h1>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a
          className="block w-full rounded-md bg-cyan-600 px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:ring-3 focus:outline-hidden sm:w-auto"
          href="#"
        >
          Get Started
        </a>

      </div>
    </div>
  </div>
</section>
  )
}

export default GetStartedBanner
