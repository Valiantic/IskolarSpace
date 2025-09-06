import React, { useEffect } from 'react'
import Image from 'next/image'
import { cardData } from '../../constants/card_data'

const AIHighlightCard = () => {
  useEffect(() => {
    async function initAOS() {
      const AOS = (await import('aos')).default;
      AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out-cubic'
      });
    }
    
    initAOS();
  }, []);
  return (
    <section id='features' className="mx-auto max-w-screen-xl px-1 py-4 sm:px-2 lg:px-3">

      <div data-aos="fade-up" className='flex items-center justify-center p-2'>
        <h1 className="text-xl sm:text-lg md:text-7xl font-bold bg-gradient-to-r from-white to-sky-500 text-transparent bg-clip-text z-20 font-poppins">
          AI-Powered Study Planner
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">

      {cardData.map(({ card_id, title, image }, index) => (
        <div
          key={card_id}
          data-aos="fade-up"
          data-aos-delay={index * 200}
          className="bg-slate-800 w-full max-w-[1000px] border border-2 p-4 border-cyan-400 rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
        >
          <div className="p-4 flex align-items-center justify-center rounded-md">
            <h3 className="text-2xl font-bold text-cyan-200 font-poppins">{title}</h3>
          </div>
          <Image
            src={image}
            alt={title}
            width={1200}
            height={800}
            className="w-full h-auto max-h-[450px] object-cover rounded-md"
          />
        </div>
      ))}
    </div>

    </section>
  )
}

export default AIHighlightCard
