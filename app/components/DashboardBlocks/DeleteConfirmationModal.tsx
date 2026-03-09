'use client'

import React from 'react';
import { CircleX, Trash2 } from 'lucide-react';

interface CustomDeleteConfirmationModalProps {
  showDeleteModal: boolean;
  handleDelete: () => void;
  setShowDeleteModal: (show: boolean) => void;
  title?: string;
  message?: string;
  count?: number;
}

const DeleteConfirmationModal: React.FC<CustomDeleteConfirmationModalProps> = ({
  showDeleteModal,
  handleDelete,
  setShowDeleteModal,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this task?",
  count,
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] overflow-hidden p-4">
      <div className="bg-gradient-to-b from-slate-900 to-black p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-red-500/30 animate-scaleIn">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Trash2 className="text-red-400" size={24} />
          </div>
          <h2 className="text-2xl font-black text-white font-poppins tracking-tight">
            {title}
          </h2>
        </div>
        
        <p className="text-slate-400 font-poppins text-sm leading-relaxed mb-8">
          {count ? `Are you sure you want to delete ${count} tasks? This action cannot be undone.` : message}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleDelete}
            className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-bold font-poppins shadow-lg shadow-red-500/20 active:scale-95"
          >
            Delete {count ? `(${count}) Items` : 'Task'} <CircleX size={18} />
          </button>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="w-full px-6 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all font-bold font-poppins border border-white/5 active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

