import React from 'react'
import Image from 'next/image'
import { useEffect } from 'react'
import StudentCollabs from '../../public/images/student_collabs.jpeg'
import Adventure from '../../public/svgs/adventure.svg'
import TaskBG  from "../../public/images/iskolartaskbg.png";


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
    
              <p className="mt-4 text-white sm:text-2xl md:text-4xl justify-content-center">
             IskolarSpace is your launchpad to a global student network. Take notes like never before, share insights, and study together with peers from around the world.
              </p>
            </div>
          </div>
    
          <div>
            <Image
              src={TaskBG}
              alt="Students collaborating"
              className="rounded"
              width={500}
              height={300}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
