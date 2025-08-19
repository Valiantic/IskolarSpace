'use client'

import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, LogOut, Globe } from 'lucide-react';
import { TAB_NAVIGATION } from '../../config/TabNavigation';
import { usePathname } from 'next/navigation';
import UserAvatar from '../../../public/images/user_avatar.png';
import useSidebar from '../../hooks/dashboard/useSidebar';
import { SidebarProps } from '../../types/dashboard';
import { useRouter } from 'next/navigation';

const Sidebar = ({ userFullName, handleLogout }: SidebarProps) => {
  const {
    isOpen,
    sidebarRef,
    openSidebar,
    closeSidebar,
    handleLogoutAction,
    profilePicture,
    spacesDropdownOpen,
    joinedSpaces,
    toggleSpacesDropdown,
  } = useSidebar();

  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Mobile View */}
      <button
        onClick={openSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-700 transition-colors"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          w-64 lg:w-80
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 p-2 text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        {/* Logo and Welcome */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-content text-white">
            <Image
              src={profilePicture || UserAvatar}
              alt="User Profile"
              width={40}
              height={40}
              className="rounded-full mr-3 border-2 border-blue-400 object-cover"
            />
            {userFullName && (
              <p className="text-slate-100 text-center sm:text-lg md:text-2xl lg:text-2xl mt-1 font-bold font-poppins">{userFullName}</p>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {TAB_NAVIGATION.map((tab) => (
              tab.label === 'Join Space' ? (
                <React.Fragment key={tab.href}>
                  <li className="flex items-center">
                    <button
                      type="button"
                      onClick={() => router.push(tab.href)}
                      className={`flex-1 flex items-center p-3 rounded-lg transition-colors font-poppins w-full ${
                        tab.match(pathname)
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                    <button
                      type="button"
                      onClick={toggleSpacesDropdown}
                      className="p-2 ml-2 text-slate-300 hover:text-white focus:outline-none"
                      aria-label="Toggle joined spaces"
                    >
                      {spacesDropdownOpen ? <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 6L12 10L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                  </li>
                  {/* Collapsible joined spaces dropdown */}
                  {spacesDropdownOpen && (
                    <li>
                      <ul className="mt-2 ml-8 space-y-1">
                        {joinedSpaces.length === 0 ? (
                          <li className="text-slate-400">No spaces joined</li>
                        ) : (
                          joinedSpaces.map((space: any) => (
                            <li key={space.space_id}>
                              <button
                                type="button"
                                onClick={() => router.push(`/space/${space.space_id}`)}
                                className="flex items-center w-full p-2 rounded-lg text-slate-200 hover:bg-blue-900 hover:text-white transition-colors"
                              >
                                <Globe size={16} className="mr-2" />
                                {space.tbl_spaces?.name || space.spaces?.name || space.name || 'Unnamed Space'}
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </li>
                  )}
                </React.Fragment>
              ) : (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={`flex items-center p-3 rounded-lg transition-colors font-poppins ${
                      tab.match(pathname)
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </Link>
                </li>
              )
            ))}
            <li>
              <a
                href=""
                onClick={() => handleLogoutAction(handleLogout)}
                className="flex items-center p-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors font-poppins"
              >
                <LogOut size={25} className="mr-3" />
                Log Out
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar
