"use client";
import React from 'react';
import { X, Settings, Crown, User, Trash2, UserMinus, Shield } from 'lucide-react';
import { SpaceSettingsModalProps } from '../../types/space-settings';
import useSpaceSettings from '../../hooks/space/useSpaceSettings';

const SpaceSettingsModal: React.FC<SpaceSettingsModalProps> = ({
  isOpen,
  onClose,
  spaceId,
  spaceName,
  members,
  currentUserId,
  onSpaceUpdated,
  onSpaceDeleted,
}) => {
  const {
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
  } = useSpaceSettings({
    spaceId,
    spaceName,
    members,
    currentUserId,
    onSpaceUpdated,
    onSpaceDeleted,
  });

  if (!isOpen || !isCurrentUserAdmin) return null;

  const safeMembers = Array.isArray(members) ? members : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl backdrop-blur-lg max-h-[90vh] overflow-y-auto">
        {/* Cosmic glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white font-poppins">Space Settings</h2>
              <Settings size={24} className="text-cyan-400" />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* Space Name Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3 font-poppins">Change Space Name</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                placeholder="Enter new space name"
              />
              <button
                onClick={handleUpdateSpaceName}
                disabled={isUpdatingName || newSpaceName.trim() === spaceName}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {isUpdatingName ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>

          {/* Members Management Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3 font-poppins">Manage Members</h3>
            <div className="space-y-3">
              {safeMembers.map((member) => {
                const isCurrentUser = member.tbl_users.id === currentUserId;
                const isAdmin = member.role === 'admin';
                const roleActionLoading = memberActions[`${member.tbl_users.id}_role`];
                const kickActionLoading = memberActions[`${member.tbl_users.id}_kick`];

                return (
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {isAdmin ? (
                        <Crown className="text-yellow-400" size={20} />
                      ) : (
                        <User className="text-gray-400" size={20} />
                      )}
                      <div>
                        <p className="text-white font-medium font-poppins">
                          {member.tbl_users.full_name}
                          {isCurrentUser && (
                            <span className="ml-2 text-cyan-400 text-sm">(You)</span>
                          )}
                        </p>
                        <p className="text-gray-400 text-sm capitalize">{member.role}</p>
                      </div>
                    </div>

                    {!isCurrentUser && (
                      <div className="flex items-center gap-2">
                        {/* Role Toggle Button */}
                        <button
                          onClick={() =>
                            handleUpdateMemberRole(
                              member.tbl_users.id,
                              isAdmin ? 'member' : 'admin'
                            )
                          }
                          disabled={roleActionLoading}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            isAdmin
                              ? 'bg-yellow-600/20 border border-yellow-500/50 text-yellow-300 hover:bg-yellow-600/30'
                              : 'bg-green-600/20 border border-green-500/50 text-green-300 hover:bg-green-600/30'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {roleActionLoading ? (
                            'Loading...'
                          ) : (
                            <>
                              <Shield size={14} className="inline mr-1" />
                              {isAdmin ? 'Remove Admin' : 'Make Admin'}
                            </>
                          )}
                        </button>

                        {/* Kick Button */}
                        <button
                          onClick={() => handleKickMember(member.tbl_users.id)}
                          disabled={kickActionLoading}
                          className="px-3 py-1 bg-red-600/20 border border-red-500/50 text-red-300 hover:bg-red-600/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {kickActionLoading ? (
                            'Kicking...'
                          ) : (
                            <>
                              <UserMinus size={14} className="inline mr-1" />
                              Kick
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delete Space Section */}
          <div className="border-t border-red-500/30 pt-6">
            <h3 className="text-lg font-semibold text-red-400 mb-3 font-poppins">Danger Zone</h3>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2 bg-red-600/20 border border-red-500/50 text-red-300 hover:bg-red-600/30 rounded-lg font-medium transition-colors"
              >
                <Trash2 size={16} className="inline mr-2" />
                Delete Space
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-red-300 text-sm font-poppins">
                  Are you sure you want to delete this space? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteSpace}
                    disabled={isDeletingSpace}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    {isDeletingSpace ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping pointer-events-none"></div>
        <div className="absolute bottom-2 right-8 w-0.5 h-0.5 bg-purple-400 rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
};

export default SpaceSettingsModal;
