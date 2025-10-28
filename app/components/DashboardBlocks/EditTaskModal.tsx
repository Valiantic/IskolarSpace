'use client'

import React, { useState, useEffect } from 'react';
import { Check, Trash, Clock, Zap, AlertCircle } from 'lucide-react';
import { EditTaskModalProps, Priority } from '../../types/dashboard';
import { Member } from '../../types/join-space';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditTaskModal: React.FC<EditTaskModalProps & {
  members?: Member[],
  assignedTo?: string | null,
  setAssignedTo?: (id: string | null) => void,
  editedPriority?: Priority,
  setEditedPriority?: (priority: Priority) => void,
  editedKanbanStatus?: 'todo' | 'in_progress' | 'done',
  setEditedKanbanStatus?: (status: 'todo' | 'in_progress' | 'done') => void,
}> = ({
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
  editedPriority,
  setEditedPriority,
  editedKanbanStatus,
  setEditedKanbanStatus,
}) => {
  // Local state for assignment dropdown
  const [localAssignedTo, setLocalAssignedTo] = useState<string | null>(assignedTo ?? null);
  const effectiveAssignedTo = typeof assignedTo !== 'undefined' ? assignedTo : localAssignedTo;
  const effectiveSetAssignedTo = typeof setAssignedTo !== 'undefined' ? setAssignedTo : setLocalAssignedTo;

  // Local state for priority and kanban status
  const [localPriority, setLocalPriority] = useState<Priority>('low');
  const [localKanbanStatus, setLocalKanbanStatus] = useState<'todo' | 'in_progress' | 'done'>('todo');

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
9
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
      if (typeof setAssignedTo !== 'undefined') {
        setAssignedTo(editingTodo.assigned_to || null);
      } else {
        setLocalAssignedTo(editingTodo.assigned_to || null);
      }

      // Set priority
      const taskPriority = editingTodo.priority || 'low';
      if (typeof setEditedPriority !== 'undefined') {
        setEditedPriority(taskPriority);
      } else {
        setLocalPriority(taskPriority);
      }

      // Set kanban status
      const taskKanbanStatus = editingTodo.kanban_status || 'todo';
      if (typeof setEditedKanbanStatus !== 'undefined') {
        setEditedKanbanStatus(taskKanbanStatus);
      } else {
        setLocalKanbanStatus(taskKanbanStatus);
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
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 animate-fadeIn p-2 sm:p-4 overflow-y-auto scrollbar-hide"
      onClick={cancelEditing}
    >
      <div className="w-full max-w-2xl mx-auto my-auto animate-scaleInLarger">
        <div
          className={`${cardColor} rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl w-full backdrop-blur-sm bg-opacity-90 transform transition-all duration-300 hover:shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto scrollbar-hide`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title Input (Optional) - Hidden during scroll */}
          <div className={`transition-all duration-300 ${isScrolling ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <input
              type="text"
              className="w-full p-2 sm:p-3 rounded-lg mb-3 text-center text-white bg-white/10 focus:outline-none border-2 border-white/20 focus:border-white/40 text-sm sm:text-base md:text-lg font-bold font-poppins placeholder:text-white/50 backdrop-blur-sm"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Task title (optional)..."
            />
          </div>
          
          {/* Priority and Status Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 mb-3">
            {/* Priority Selector */}
            <div>
              <label className="block text-white/70 text-xs sm:text-sm font-poppins mb-1">Priority</label>
              <select
                value={editedPriority || localPriority}
                onChange={e => {
                  const newPriority = e.target.value as Priority;
                  if (typeof setEditedPriority !== 'undefined') {
                    setEditedPriority(newPriority);
                  } else {
                    setLocalPriority(newPriority);
                  }
                }}
                className="w-full p-2 rounded-lg bg-gray-800 text-white font-poppins text-sm sm:text-base"
              >
                <option value="low">Low Priority</option>
                <option value="moderate">Moderate Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            {/* Kanban Status Selector */}
            <div>
              <label className="block text-white/70 text-xs sm:text-sm font-poppins mb-1">Status</label>
              <select
                value={editedKanbanStatus || localKanbanStatus}
                onChange={e => {
                  const newStatus = e.target.value as 'todo' | 'in_progress' | 'done';
                  if (typeof setEditedKanbanStatus !== 'undefined') {
                    setEditedKanbanStatus(newStatus);
                  } else {
                    setLocalKanbanStatus(newStatus);
                  }
                }}
                className="w-full p-2 rounded-lg bg-gray-800 text-white font-poppins text-sm sm:text-base"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Assignment Dropdown for space page */}
          {typeof members !== 'undefined' && Array.isArray(members) && members.length > 0 && (
            <div className="mb-3">
              <label className="block text-white/70 text-xs sm:text-sm font-poppins mb-1">Assign to</label>
              <select
                value={effectiveAssignedTo ?? ""}
                onChange={e => effectiveSetAssignedTo(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-800 text-white font-poppins text-sm sm:text-base"
              >
                <option value="">Unassigned</option>
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
            </div>
          )}
          {/* Content Textarea */}
          <textarea
            className={`w-full p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 resize-none text-white bg-transparent focus:outline-none border-0 text-base sm:text-lg leading-relaxed overflow-auto scrollbar-hide font-poppins placeholder:text-white/50 transition-all duration-300 ${
              isScrolling ? 'h-[250px] sm:h-[350px]' : 'h-40 sm:h-48 md:h-56'
            }`}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onScroll={handleTextareaScroll}
            placeholder="Enter your task details..."
          />
          
          {/* Save and Delete Buttons */}
          <div className="flex flex-col gap-3 mt-4 sm:mt-6">
            {/* Deadline Picker */}
            <div className={`flex items-center px-2 py-1 rounded-lg w-full sm:max-w-xs relative ${(() => {
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
                className={`w-full text-start p-2 rounded-lg bg-transparent font-poppins pl-8 border-0 focus:outline-none text-sm sm:text-base ${editedDeadline && (() => {
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full">
                <button
                onClick={() => {
                  if (editingTaskId) {
                  setTodoToDelete(editingTaskId);
                  setShowDeleteModal(true);
                  }
                }}
                className="flex items-center justify-center gap-2 text-red-700 hover:text-red-900 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/80 hover:bg-white/90 transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20 flex-1 text-sm sm:text-base"
                >
                <Trash size={20} className="sm:w-7 sm:h-7" />
                Delete
                </button>
                <button
                onClick={() => editingTaskId && handleSaveEdit(editingTaskId)}
                className="flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/80 hover:bg-white/90 transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20 flex-1 text-sm sm:text-base"
                >
                <Check size={20} className="sm:w-7 sm:h-7" />
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
