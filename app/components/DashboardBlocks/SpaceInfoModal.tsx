import React from 'react';

interface Member {
  id: string;
  full_name: string;
}

interface SpaceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  spaceCode: string;
  isLoading: boolean;
  error?: string | null;
}

const SpaceInfoModal: React.FC<SpaceInfoModalProps> = ({ isOpen, onClose, members, spaceCode, isLoading, error }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Space Info</h2>
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">Space Code:</div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded">{spaceCode || 'N/A'}</span>
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-2">Members:</div>
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading members...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <ul className="space-y-2">
              {members.length === 0 ? (
                <li className="text-gray-400 text-center">No members found.</li>
              ) : (
                members.map((member) => (
                  <li key={member.id} className="flex items-center gap-2 text-gray-700">
                    <span className="font-semibold">{member.full_name}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceInfoModal;
