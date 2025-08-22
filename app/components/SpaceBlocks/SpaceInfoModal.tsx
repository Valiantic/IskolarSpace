import React from 'react';
import useClipboard from '../../hooks/utils/useClipboard';
import { X, Orbit, User, Crown } from 'lucide-react';
import { Member, SpaceInfoModalProps } from '../../types/join-space';

const SpaceInfoModal: React.FC<SpaceInfoModalProps> = ({ isOpen, onClose, members, spaceCode, spaceName, isLoading, error, onLeaveSpace, leaving }) => {
  const { copyToClipboard, copied } = useClipboard();
  if (!isOpen) return null;
  const safeMembers = Array.isArray(members) ? members : [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-slate-800 rounded-xl shadow-xl p-4 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Close"
        >
          <X className='w-8 h-8' />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-white font-poppins">
          {spaceName ? spaceName : 'Space Info'}
          <Orbit size={25} className="inline-block text-blue-500 ml-2" />
        </h2>
        <div className="text-lg sm:text-sm md:text-lg text-white mb-2">Members:</div>
        <div className="p-4 rounded-lg mb-2 bg-slate-700">
          {isLoading ? (
            <div className="text-center py-4 text-gray-300">Loading members...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-400">{error}</div>
          ) : (
            <ul className="space-y-2 list-disc list-inside">
              {safeMembers.length === 0 ? (
          <li className="text-gray-400 text-center">No members found.</li>
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
              <li
                key={member.user_id}
                className="flex items-center gap-2 text-white font-poppins"
                style={{ listStyleType: 'disc', color: 'white' }}
              >
                {isAdmin ? <Crown className="inline-block mr-2 text-yellow-400" /> : <User className="inline-block mr-2" />}
                <span className="font-semibold">{fullName}</span>
              </li>
            );
          })
              )}
            </ul>
          )}
        </div>
        <div className="mb-6">
          <div className="text-lg sm:text-sm md:text-lg text-white mb-2">Space Code:</div>
          <div className="flex justify-center items-center gap-2">
            <span
              className="font-mono text-lg font-semibold w-full text-center text-blue-700 bg-blue-100 px-3 py-1 rounded cursor-pointer select-all"
              onClick={() => copyToClipboard(spaceCode)}
              title="Click to copy"
              style={{ userSelect: 'all' }}
            >
              {copied ? 'Copied!' : (spaceCode || 'N/A')}
            </span>
          </div>
          <button
            className="w-full mt-4 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
            onClick={onLeaveSpace}
            disabled={leaving}
          >
            {leaving ? 'Leaving...' : 'Leave Space'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpaceInfoModal;
