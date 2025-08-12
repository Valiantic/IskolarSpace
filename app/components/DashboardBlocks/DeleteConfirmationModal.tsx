'use client'

import React from 'react';
import { CircleX } from 'lucide-react';

interface DeleteConfirmationModalProps {
  showDeleteModal: boolean;
  handleDelete: () => void;
  setShowDeleteModal: (show: boolean) => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  showDeleteModal,
  handleDelete,
  setShowDeleteModal,
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] overflow-hidden">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-lg shadow-xl max-w-sm w-full border border-red-500 m-4 animate-scaleIn">
        <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400 font-poppins">
          Confirm Deletion
        </h2>
        <p className="text-gray-300 font-poppins">
          Are you sure you want to delete this task?
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-slate-700 text-gray-200 rounded-lg hover:bg-slate-600 transition-colors font-poppins"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-colors font-poppins"
          >
            Delete <CircleX size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
