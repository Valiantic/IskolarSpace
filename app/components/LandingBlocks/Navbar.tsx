"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Logo from '../../../public/svgs/iskolarspace_logo.svg';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goToLogin = () => {
    router.push('/login');
  }

  const goToSignup = () => {
    router.push('/signup');
  }

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false); 
  }

  return (
    <div className='fixed top-0 left-0 w-full px-4 sm:px-8 lg:px-16 pt-4 z-[9999] bg-transparent backdrop-blur-sm mt-4'>
        <nav className="bg-gray-900 w-full border border-cyan-500/30 rounded-2xl px-6 py-4 shadow-lg shadow-cyan-500/20">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
            <Image 
              src={Logo} 
              alt="IskolarSpace Logo" 
              width={40} 
              height={40} 
              className="w-10 h-10 object-cover"
            />
          <span className="text-white text-2xl font-semibold">IskolarSpace</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden text-xl gap-10 font-bold md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection('home')}
            className="text-white hover:text-cyan-400 transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-white hover:text-cyan-400 transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-white hover:text-cyan-400 transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            Features
          </button>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={goToLogin} className="text-white text-xl font-bold hover:text-cyan-400 transition-colors duration-300 ease-in-out transform hover:scale-105">
            Log in
          </button>
          <button onClick={goToSignup} className="bg-cyan-500 text-xl font-bold hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white hover:text-cyan-400 transition-colors duration-300"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
          <div className="flex flex-col space-y-4">
            <a 
              href="#home" 
              className="text-white hover:text-cyan-400 transition-colors duration-300 ease-in-out py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#about" 
              className="text-white hover:text-cyan-400 transition-colors duration-300 ease-in-out py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="#features" 
              className="text-white hover:text-cyan-400 transition-colors duration-300 ease-in-out py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
              <button onClick={goToLogin} className="text-white hover:text-cyan-400 transition-colors duration-300 ease-in-out text-left py-2">
                Log in
              </button>
              <button onClick={goToSignup} className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 w-full">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
    </div>
  );
};

export default Navbar;