'use client';

import React from 'react'
import Sidebar from '../components/DashboardBlocks/Sidebar'
import SpaceBackground from '../components/DashboardBlocks/SpaceBackground'
import useSidebar from '../hooks/dashboard/useSidebar'
import JoinSpace from '../components/JoinSpaceBlocks/JoinSpace';
import CreateSpaceButton from '../components/JoinSpaceBlocks/CreateSpaceButton';
import CreateSpaceModal from '../components/JoinSpaceBlocks/CreateSpaceModal';
import useCreateSpaceModal from '../hooks/join-space/useCreateSpaceModal';
import { useAuth } from '../hooks/auth/useAuth'

const Page = () => {
  const {
    spaceName,
    spaceCode,
    isOpen,
    isGenerating,
    openModal,
    closeModal,
    handleSpaceNameChange,
    handleSpaceCodeChange,
    handleGenerateCode,
    onCreateSpace,
  } = useCreateSpaceModal();

  const { logout, user } = useAuth();
  const { userFullName } = useSidebar();

  const userId = user?.id;

  return (
    <div className="relative min-h-screen">
      <SpaceBackground/>
      <Sidebar 
      userFullName={userFullName}
      handleLogout={logout}
      />
      <div className='flex justify-center align-items-center'>
        <JoinSpace userId={userId} />
      </div>
      <div className='absolute bottom-9 right-10'>
        <CreateSpaceButton 
          onClick={openModal}
        />
      </div>

        {/* Modal */}
      <CreateSpaceModal
        isOpen={isOpen}
        onClose={closeModal}
        onCreateSpace={onCreateSpace}
        spaceName={spaceName}
        spaceCode={spaceCode}
        isGenerating={isGenerating}
        onSpaceNameChange={handleSpaceNameChange}
        onSpaceCodeChange={handleSpaceCodeChange}
        onGenerateCode={handleGenerateCode}
        userId={userId}
      />
    </div>
  )
}

export default Page
