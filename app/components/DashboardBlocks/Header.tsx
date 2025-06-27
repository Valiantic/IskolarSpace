import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image';
import IskolarSpaceLogo from '../../../public/images/iskolarspace_logo.png'
import UserAvatar from '../../../public/images/user_avatar.png'

interface HeaderProps {
  isNewUser: boolean;
  userFullName: string | null;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isNewUser, userFullName, handleLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="sm:text-xs md:text-lg text-white font-bold shadow-lg">
            <h1 className="font-bold sm:text-xs md:text-4xl">
              {isNewUser ? 'Welcome!' : 'Welcome Back!'}
              {userFullName ? ` ${userFullName}` : ''}
              <Image
                src={IskolarSpaceLogo}
                alt="IskolarSpace Logo"
                className="inline-block ml-2 h-8 w-8 sm:h-10 sm:w-10"
              />
            </h1>
          </div>
          
          {/* User Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center rounded-full overflow-hidden transition-transform duration-200 hover:scale-105 focus:outline-none border-2 border-blue-400 hover:border-blue-500"
            >
              <Image
                src={UserAvatar}
                alt="User Profile"
                width={48}
                height={48}
                className="object-cover"
              />
            </button>
            
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl z-50 transform transition-all duration-300 animate-fadeIn">
                <div className="py-2 px-4 border-b border-slate-700">
                  <p className="text-white font-medium truncate">
                    {userFullName || 'User'}
                  </p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700 hover:text-red-300 flex items-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  )
}

export default Header
