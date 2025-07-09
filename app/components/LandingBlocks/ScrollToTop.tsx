'use client';

import React, { useEffect, useState} from 'react'
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
   const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);


  return (
    <>
    {isVisible && (
        <button onClick={scrollToTop}
        className='fixed bottom-10 right-10 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:bg-cyan-600 transition-colors duration-300 ease-in-out z-50'
        >
            <ArrowUp />
        </button>
    )}
    </>
  )
}

export default ScrollToTop
