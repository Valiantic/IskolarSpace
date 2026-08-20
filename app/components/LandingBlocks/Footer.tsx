'use client';

import { Github, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../../public/svgs/iskolarspace_logo.svg';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-card text-card-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <Image 
                src={Logo} 
                alt="IskolarSpace Logo" 
                width={40} 
                height={40} 
                className="w-10 h-10 object-cover"
              />
              <span className="text-xl font-semibold text-white">IskolarSpace</span>
            </div>
            <p className="mt-4 sm:text-lg md:text-xl text-slate-400 font-medium">
              Connecting students across the globe through collaborative note-taking.
            </p>
          </div>
          <div className='text-slate-300'>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/#home" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="sm:text-lg md:text-xl font-semibold text-white">Connect With Us</h3>
            <div className="flex space-x-4 mt-4 text-slate-400 sm:text-lg md:text-xl">
              <Link href="https://www.instagram.com/stevemadali/" aria-label="Instagram" className="hover:text-white transition-colors">
                <Instagram size={24} />
              </Link>
              <Link href="https://github.com/Valiantic" aria-label="GitHub" className="hover:text-white transition-colors">
                <Github size={24} />
              </Link>
              <Link href="https://www.linkedin.com/in/steven-madali/" aria-label="LinkedIn" className="hover:text-white transition-colors">
                <Linkedin size={24} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
          <p>Designed and developed by Steven Gabriel Madali. Copyright &copy; {currentYear} IskolarSpace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
