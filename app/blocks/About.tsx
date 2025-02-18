import React from 'react'
import Image from 'next/image'
import { useEffect } from 'react'
import StudentCollabs from '../../public/images/student_collabs.jpeg'
import Adventure from '../../public/svgs/adventure.svg'

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
    
              <p className="mt-4 text-white">
              IskolarSpace is a cutting-edge online platform designed to revolutionize the way students manage their academic responsibilities. By providing tools that streamline task management and foster meaningful connections among peers, IskolarSpace empowers students to take control of their educational journey and achieve success with confidence.
              </p>
            </div>
          </div>
    
          <div>
            <Image
              src={Adventure}
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
