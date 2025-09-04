"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { SpaceSettingsHookProps, Member } from '../../types/space-settings';

const useSpaceSettings = ({ 
  spaceId, 
  spaceName, 
  members, 
  currentUserId, 
  onSpaceUpdated, 
  onSpaceDeleted 
}: SpaceSettingsHookProps) => {
  const router = useRouter();
  const [newSpaceName, setNewSpaceName] = useState(spaceName);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isDeletingSpace, setIsDeletingSpace] = useState(false);
  const [memberActions, setMemberActions] = useState<Record<string, boolean>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Check if current user is admin
  const isCurrentUserAdmin = members.some(
    (member: Member) => member.tbl_users.id === currentUserId && member.role === 'admin'
  );

  // Update space name
  const handleUpdateSpaceName = async () => {
    if (!newSpaceName.trim() || newSpaceName === spaceName) {
      toast.error('Please enter a new space name');
      return;
    }

    setIsUpdatingName(true);
    try {
      const response = await fetch('/api/spaces/update-name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaceId,
          newName: newSpaceName.trim(),
        }),
      });

      if (response.ok) {
        toast.success('Space name updated successfully');
        onSpaceUpdated();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update space name');
      }
    } catch (error) {
      console.error('Error updating space name:', error);
      toast.error('Failed to update space name');
    } finally {
      setIsUpdatingName(false);
    }
  };

  // Delete space
  const handleDeleteSpace = async () => {
    setIsDeletingSpace(true);
    try {
      const response = await fetch('/api/spaces/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spaceId }),
      });

      if (response.ok) {
        toast.success('Space deleted successfully');
        onSpaceDeleted();
        router.push('/dashboard');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete space');
      }
    } catch (error) {
      console.error('Error deleting space:', error);
      toast.error('Failed to delete space');
    } finally {
      setIsDeletingSpace(false);
      setShowDeleteConfirm(false);
    }
  };

  // Update member role
  const handleUpdateMemberRole = async (userId: string, newRole: 'admin' | 'member') => {
    const actionKey = `${userId}_role`;
    setMemberActions(prev => ({ ...prev, [actionKey]: true }));

    try {
      const response = await fetch('/api/spaces/update-member-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaceId,
          userId,
          role: newRole,
        }),
      });

      if (response.ok) {
        toast.success(`Member ${newRole === 'admin' ? 'promoted to admin' : 'demoted to member'}`);
        onSpaceUpdated();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update member role');
      }
    } catch (error) {
      console.error('Error updating member role:', error);
      toast.error('Failed to update member role');
    } finally {
      setMemberActions(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  // Kick member
  const handleKickMember = async (userId: string) => {
    const actionKey = `${userId}_kick`;
    setMemberActions(prev => ({ ...prev, [actionKey]: true }));

    try {
      const response = await fetch('/api/spaces/kick-member', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaceId,
          userId,
        }),
      });

      if (response.ok) {
        toast.success('Member kicked successfully');
        onSpaceUpdated();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to kick member');
      }
    } catch (error) {
      console.error('Error kicking member:', error);
      toast.error('Failed to kick member');
    } finally {
      setMemberActions(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  return {
    newSpaceName,
    setNewSpaceName,
    isUpdatingName,
    isDeletingSpace,
    memberActions,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isCurrentUserAdmin,
    handleUpdateSpaceName,
    handleDeleteSpace,
    handleUpdateMemberRole,
    handleKickMember,
  };
};

export default useSpaceSettings;
