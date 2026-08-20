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
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white z-20 font-syncopate tracking-tight text-center">
          AI-Powered Study Planner
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">

      {cardData.map(({ card_id, title, image }, index) => (
        <div
          key={card_id}
          data-aos="fade-up"
          data-aos-delay={index * 200}
          className="bg-[#0c0c0e] border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-cyan-500/10 hover:border-white/20 transition-all duration-300 group flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            <p className="text-sm text-slate-400">Experience intelligent scheduling powered by IskolarSpace AI.</p>
          </div>
          
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/5 bg-black/50 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </div>
      ))}
    </div>

    </section>
  )
}

export default AIHighlightCard
