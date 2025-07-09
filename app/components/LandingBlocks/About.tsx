import React, { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import Homepage from '../../../public/images/homepage.png'


const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }

      if (isModalOpen) {
        document.addEventListener('keydown', handleKeyDown);
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isModalOpen]);

  return (
   <>
    <section>
      <div id="about" className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
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
    
          <div className='relative group'>
            <div 
            onClick={openModal}
            className='cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105'
            >
            <Image
              src={Homepage}
              alt="Students collaborating"
              className="rounded w-full h-auto transition-transform duration-300 hover:scale-105"
              width={900}
              height={700}
            />
          </div>
          </div>

        </div>
      </div>
    </section>

    {isModalOpen && (
      <div
      className='fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 animate-fadeIn'
      onClick={handleBackdropClick}
      >

      <button
      onClick={closeModal}
      className='absolute top-4 right-4 z-[10001] bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200 hover:scale-110'
      aria-label="Close modal"
      >
        <X className='w-6 h-6' />
      </button>

      <div className="relative max-w-7xl max-h-[90vh w-full h-full flex items-center justify-center animate-scaleIn">
        <Image
          src={Homepage}
          alt="IskolarSpace Homepage"
          className='max-w-full max-h-full object-contain rounded-lg shadow-2xl'
          width={1800}
          height={1400}
          quality={95}
          priority
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className='text-white text-sm sm:text-base md:text-lg'>
          Press <span className="font-bold">Esc</span> or click outside the image to close.
        </p>
      </div>

      </div>
    )}
   </>
  )
}

export default About
