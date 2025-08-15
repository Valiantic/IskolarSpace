'use client';

import React from 'react'
import Sidebar from '../components/DashboardBlocks/Sidebar'
import SpaceBackground from '../components/DashboardBlocks/SpaceBackground'
import useSidebar from '../hooks/dashboard/useSidebar'
import JoinSpace from '../components/JoinSpaceBlocks/JoinSpace';
import CreateSpaceButton from '../components/JoinSpaceBlocks/CreateSpaceButton';
import { useAuth } from '../hooks/auth/useAuth'

const Page = () => {
  const { logout } = useAuth();
  const { userFullName } = useSidebar();

  return (
    <div className="relative min-h-screen">
      <SpaceBackground/>
      <Sidebar 
      userFullName={userFullName}
      handleLogout={logout}
      />
      <div className='flex justify-center align-items-center'>
        <JoinSpace />
      </div>
      <div className='absolute bottom-9 right-10'>
        <CreateSpaceButton />
      </div>
    </div>
  )
}

export default Page
