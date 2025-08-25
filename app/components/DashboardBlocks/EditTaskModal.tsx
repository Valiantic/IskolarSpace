'use client'

import React, { useState, useEffect } from 'react';
import { Check, Trash, Clock } from 'lucide-react';
import { EditTaskModalProps } from '../../types/dashboard';
import { Member } from '../../types/join-space';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditTaskModal: React.FC<EditTaskModalProps & { members?: Member[], assignedTo?: string | null, setAssignedTo?: (id: string | null) => void }> = ({
  editingTaskId,
  todos,
  editedContent,
  editedTitle,
  editedDeadline,
  setEditedContent,
  setEditedTitle,
  setEditedDeadline,  
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  const todoIndex = todos.findIndex(todo => todo.id === editingTaskId);
  const editingTodo = todoIndex >= 0 ? todos[todoIndex] : null;

  // When editingTaskId changes, always reset editedDeadline to the correct value for that task
  useEffect(() => {
    if (editingTodo) {
      if (editingTodo.deadline) {
        const deadlineDate = typeof editingTodo.deadline === 'string' ? new Date(editingTodo.deadline) : editingTodo.deadline;
        setEditedDeadline(deadlineDate);
      } else {
        setEditedDeadline(null);
      }
    }
  }, [editingTaskId]);

  if (!editingTaskId) return null;

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
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
            <div className={`flex items-center px-2 py-1 rounded-lg mr-2 w-full max-w-xs relative ${(() => {
              if (!editedDeadline) return 'bg-black/20';
              const deadlineDate = new Date(editedDeadline);
              const today = new Date();
              return deadlineDate.getFullYear() === today.getFullYear() &&
                deadlineDate.getMonth() === today.getMonth() &&
                deadlineDate.getDate() === today.getDate()
                ? 'bg-red-700/80' : 'bg-black/20';
            })()}`}>
              <Clock size={18} className={`${editedDeadline && (() => {
                const deadlineDate = new Date(editedDeadline);
                const today = new Date();
                return deadlineDate.getFullYear() === today.getFullYear() &&
                  deadlineDate.getMonth() === today.getMonth() &&
                  deadlineDate.getDate() === today.getDate()
                  ? 'text-red-300' : 'text-white';
              })() || 'text-white'} mr-1 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none`} />
              <DatePicker
                selected={editedDeadline}
                value={editedDeadline ? new Date(editedDeadline).toLocaleDateString() : ''}
                onChange={(date) => setEditedDeadline(date)}
                className={`w-full text-start p-2 rounded-lg bg-transparent font-poppins pl-8 border-0 focus:outline-none ${editedDeadline && (() => {
                  const deadlineDate = new Date(editedDeadline);
                  const today = new Date();
                  return deadlineDate.getFullYear() === today.getFullYear() &&
                    deadlineDate.getMonth() === today.getMonth() &&
                    deadlineDate.getDate() === today.getDate()
                    ? 'text-red-300 font-bold' : 'text-white';
                })() || 'text-white'}`}
                dateFormat="dd-MM-yyyy"
                placeholderText="Set a deadline"
              />
            </div>
            <div className="flex flex-row gap-2 justify-center w-full mt-2 sm:mt-0">
                <button
                onClick={() => {
                  if (editingTaskId) {
                  setTodoToDelete(editingTaskId);
                  setShowDeleteModal(true);
                  }
                }}
                className="flex items-center justify-start gap-2 text-red-700 hover:text-red-900 px-6 py-3 rounded-full bg-white/80 hover:bg-white/90 transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20 flex-1"
                >
                <Trash size={28} className="mr-2" />
                Delete
                </button>
                <button
                onClick={() => editingTaskId && handleSaveEdit(editingTaskId)}
                className="flex items-center justify-start gap-2 text-slate-700 hover:text-slate-900 px-6 py-3 rounded-full bg-white/80 hover:bg-white/90 transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20 flex-1"
                >
                <Check size={28} className="mr-2" />
                Save
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
