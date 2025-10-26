import React from 'react';
import useClipboard from '../../hooks/utils/useClipboard';
import { X, Orbit, User, Crown, Settings } from 'lucide-react';
import { Member, SpaceInfoModalProps } from '../../types/join-space';

const SpaceInfoModal: React.FC<SpaceInfoModalProps> = ({ 
  isOpen, 
  onClose, 
  members, 
  spaceCode, 
  spaceName, 
  isLoading, 
  error, 
  onLeaveSpace, 
  leaving,
  currentUserId,
  onOpenSettings
}) => {
  const { copyToClipboard, copied } = useClipboard();
  if (!isOpen) return null;
  
  const safeMembers = Array.isArray(members) ? members : [];
  
  // Check if current user is admin
  const isCurrentUserAdmin = currentUserId && safeMembers.some(
    (member: Member) => {
      const userId = Array.isArray(member.tbl_users) 
        ? member.tbl_users[0]?.id 
        : member.tbl_users?.id;
      return userId === currentUserId && member.role === 'admin';
    }
  );
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl backdrop-blur-lg max-h-[90vh]">
        {/* Cosmic glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl pointer-events-none"></div>

        {/* Scrollable content with hidden scrollbar */}
  <div className="relative z-10 overflow-y-auto max-h-[75vh] pr-2 no-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white font-poppins">
                {spaceName ? spaceName : 'Space Info'}
              </h2>
              {isCurrentUserAdmin && onOpenSettings ? (
                <button
                  onClick={onOpenSettings}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Space Settings"
                >
                  <Settings size={24} className="text-cyan-400" />
                </button>
              ) : (
                <Orbit size={24} className="text-cyan-400" />
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* Members Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3 font-poppins">Members</h3>
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
              {isLoading ? (
                <div className="text-center py-4 text-gray-300 font-poppins">Loading members...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-400 font-poppins">{error}</div>
              ) : (
                <div className="space-y-3">
                  {safeMembers.length === 0 ? (
                    <div className="text-gray-400 text-center font-poppins">No members found.</div>
                  ) : (
                    safeMembers.map((member) => {
                      let fullName = 'Unnamed Member';
                      if (Array.isArray(member.tbl_users) && member.tbl_users.length > 0) {
                        fullName = member.tbl_users[0]?.full_name || 'Unnamed Member';
                      } else if (member.tbl_users && typeof member.tbl_users === 'object' && 'full_name' in member.tbl_users) {
                        fullName = member.tbl_users.full_name || 'Unnamed Member';
                      }
                      const isAdmin = member.role === 'admin';
                      return (
                        <div
                          key={member.user_id}
                          className="flex items-center gap-3 p-3 bg-slate-600/20 border border-slate-500/30 rounded-lg"
                        >
                          {isAdmin ? (
                            <Crown className="text-yellow-400" size={20} />
                          ) : (
                            <User className="text-gray-400" size={20} />
                          )}
                          <div>
                            <p className="text-white font-medium font-poppins">{fullName}</p>
                            <p className="text-gray-400 text-sm capitalize font-poppins">{member.role}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Space Code Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3 font-poppins">Space Code</h3>
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
              <div
                className="font-mono text-lg font-semibold text-center text-cyan-300 bg-slate-800/50 border border-cyan-500/30 px-4 py-3 rounded-lg cursor-pointer select-all transition-colors hover:bg-slate-800/70"
                onClick={() => copyToClipboard(spaceCode)}
                title="Click to copy"
                style={{ userSelect: 'all' }}
              >
                {copied ? '✓ Copied!' : (spaceCode || 'N/A')}
              </div>
              <p className="text-gray-400 text-sm text-center mt-2 font-poppins">
                Click to copy space code
              </p>
            </div>
          </div>

          {/* Leave Space Section */}
          <div className="border-t border-red-500/30 pt-6 bottom-0 bg-gradient-to-t from-slate-900/95 to-transparent pb-2 z-20">
            <h3 className="text-lg font-semibold text-red-400 mb-3 font-poppins">Leave Space</h3>
            <button
              onClick={onLeaveSpace}
              disabled={leaving}
              className="w-full py-3 px-4 bg-red-600/20 border border-red-500/50 text-red-300 hover:bg-red-600/30 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-poppins"
            >
              {leaving ? 'Leaving...' : 'Leave Space'}
            </button>
          </div>
  </div>

        {/* Decorative elements */}
        <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping pointer-events-none"></div>
        <div className="absolute bottom-2 right-8 w-0.5 h-0.5 bg-purple-400 rounded-full pointer-events-none"></div>
      </div>
    </div>
  );
};

export default SpaceInfoModal;
