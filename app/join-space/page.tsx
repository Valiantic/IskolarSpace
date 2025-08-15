'use client';

import React from 'react'
import Sidebar from '../components/DashboardBlocks/Sidebar'
import SpaceBackground from '../components/DashboardBlocks/SpaceBackground'
import useSidebar from '../hooks/dashboard/useSidebar'
import { useAuth } from '../hooks/auth/useAuth'

const page = () => {
  const { logout } = useAuth();
  const { userFullName } = useSidebar();

  return (
    <div>
      <Sidebar 
      userFullName={userFullName}
      handleLogout={logout}
      />
      <SpaceBackground />
    </div>
  )
}

export default page
