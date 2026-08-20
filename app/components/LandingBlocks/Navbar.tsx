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
    <div className='fixed top-0 left-0 w-full px-4 sm:px-8 lg:px-16 pt-4 z-[9999] bg-transparent mt-4'>
        <nav className="bg-[#09090b]/90 backdrop-blur-md w-full border border-white/10 rounded-2xl px-6 py-4 shadow-xl">
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
          <span className="text-white z-20 text-2xl font-semibold font-poppins">IskolarSpace</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden text-xl gap-10 font-bold font-poppins lg:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection('home')}
            className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            Features
          </button>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={goToLogin} className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
            Log in
          </button>
          <button onClick={goToSignup} className="bg-white text-sm font-medium text-slate-900 hover:bg-slate-200 px-5 py-2 rounded-lg transition-colors">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-slate-300 hover:text-white transition-colors duration-200"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/10">
          <div className="flex flex-col space-y-4">
            <a 
              href="#home" 
              className="text-slate-300 hover:text-white transition-colors duration-300 py-2 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#about" 
              className="text-slate-300 hover:text-white transition-colors duration-300 py-2 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="#features" 
              className="text-slate-300 hover:text-white transition-colors duration-300 py-2 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
              <button onClick={goToLogin} className="text-slate-300 hover:text-white transition-colors duration-300 text-left py-2 text-sm font-medium">
                Log in
              </button>
              <button onClick={goToSignup} className="bg-white hover:bg-slate-200 text-slate-900 px-6 py-2 rounded-lg transition-colors w-full text-sm font-medium">
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