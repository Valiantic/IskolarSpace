import React from 'react'
import Image from 'next/image'
import { useEffect } from 'react'
import Homepage from '../../public/images/homepage.png'


const About = () => {

  useEffect(() => {
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
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
          <div>
            <div className="max-w-lg md:max-w-none">
              <h2 data-aos="fade-right" className="text-4xl font-semibold z-20 bg-gradient-to-r from-white to-sky-500 text-transparent bg-clip-text">
                What is IskolarSpace?
              </h2>
    
              <p className="mt-4 text-white sm:text-2xl md:text-2xl justify-content-center">
            "IskolarSpace is your ultimate platform for organizing and mastering your academic workflow. Take notes effortlessly, track tasks efficiently, and structure your studies like never before."
              </p>
            </div>
          </div>
    
          <div>
            <Image
              src={Homepage}
              alt="Students collaborating"
              className="rounded"
              width={900}
              height={700}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
