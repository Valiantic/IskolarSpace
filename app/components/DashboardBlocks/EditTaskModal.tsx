'use client'

import React, { useState, useEffect } from 'react';
import { Check, Trash } from 'lucide-react';
import { Todo, EditTaskModalProps } from '../../types/dashboard';
import { Member } from '../../types/join-space';

const EditTaskModal: React.FC<EditTaskModalProps & { members?: Member[], assignedTo?: string | null, setAssignedTo?: (id: string | null) => void }> = ({
  editingTaskId,
  todos,
  editedContent,
  editedTitle,
  setEditedContent,
  setEditedTitle,
  handleSaveEdit,
  setShowDeleteModal,
  setTodoToDelete,
  cancelEditing,
  members,
  assignedTo,
  setAssignedTo,
}) => {
  // Local state for assignment dropdown
  const [localAssignedTo, setLocalAssignedTo] = useState<string | null>(assignedTo ?? null);
  const effectiveAssignedTo = typeof assignedTo !== 'undefined' ? assignedTo : localAssignedTo;
  const effectiveSetAssignedTo = typeof setAssignedTo !== 'undefined' ? setAssignedTo : setLocalAssignedTo;
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount - MUST be before conditional return
  useEffect(() => {
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  if (!editingTaskId) return null;

  const todoIndex = todos.findIndex(todo => todo.id === editingTaskId);
  
  // Darker, smoother color palette
  const cardColors = [
    'bg-slate-700',
    'bg-gray-700', 
    'bg-stone-700',
    'bg-zinc-700',
    'bg-neutral-700',
    'bg-slate-600'
  ];
  
  const cardColor = todoIndex >= 0 ? cardColors[todoIndex % cardColors.length] : 'bg-slate-700';

  const handleTextareaScroll = () => {
    setIsScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Set new timeout to hide scrolling state after 1.5 seconds
    const newTimeout = setTimeout(() => {
      setIsScrolling(false);
    }, 1500);
    
    setScrollTimeout(newTimeout);
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 animate-fadeIn overflow-hidden p-4"
      onClick={cancelEditing}
    >
      <div className="w-full p-4 max-w-4xl mx-auto animate-scaleInLarger overflow-hidden max-h-full">
        <div 
          className={`${cardColor} rounded-xl p-12 shadow-2xl w-full backdrop-blur-sm bg-opacity-90 transform transition-all duration-300 hover:shadow-2xl min-h-[60vh] overflow-hidden border border-white/10`}
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Title Input (Optional) - Hidden during scroll */}
          <div className={`transition-all duration-300 ${isScrolling ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <input
              type="text"
              className="w-full p-4 rounded-lg mb-4 text-center text-white bg-white/10 focus:outline-none border-2 border-white/20 focus:border-white/40 text-xl font-bold font-poppins placeholder:text-white/50 backdrop-blur-sm"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Task title (optional)..."
            />
          </div>
          
          {/* Assignment Dropdown for space page */}
          {typeof members !== 'undefined' && Array.isArray(members) && members.length > 0 && (
            <select
              value={effectiveAssignedTo ?? ""}
              onChange={e => effectiveSetAssignedTo(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 text-white mb-3 p-2 px-2 font-poppins"
            >
              <option value="">Assign to...</option>
              {members.map((member: Member) => {
                const user = Array.isArray(member.tbl_users)
                  ? member.tbl_users[0] as { id?: string; full_name?: string }
                  : member.tbl_users as { id?: string; full_name?: string };
                return user && typeof user.id === 'string' ? (
                  <option key={user.id} value={user.id}>
                    {user.full_name ?? 'Unnamed Member'}
                  </option>
                ) : null;
              })}
            </select>
          )}
          {/* Content Textarea */}
          <textarea
            className={`w-full p-6 rounded-lg mb-6 resize-none text-white bg-transparent focus:outline-none border-0 text-lg md:text-lg font-bold leading-relaxed overflow-auto no-scrollbar font-poppins placeholder:text-white/50 transition-all duration-300 ${
              isScrolling ? 'h-[500px]' : 'h-80'
            }`}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onScroll={handleTextareaScroll}
            placeholder="Enter your task details..."
          />
          
          {/* Save and Delete Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => {
                if (editingTaskId) {
                  setTodoToDelete(editingTaskId);
                  setShowDeleteModal(true);
                }
              }}
              className="text-red-700 hover:text-red-900 px-8 py-4 rounded-full bg-white/80 hover:bg-white/90 transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20"
            >
              <Trash size={28} />
            </button>
            <button
              onClick={() => editingTaskId && handleSaveEdit(editingTaskId)}
              className="text-slate-700 hover:text-slate-900 px-8 py-4 rounded-full bg-white/80 hover:bg-white/90 transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20"
            >
              <Check size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
