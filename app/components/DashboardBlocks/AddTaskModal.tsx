'use client'

import React, { useState } from 'react';
import { Rocket, Clock, AlertCircle, Zap, X } from 'lucide-react';
import { Priority } from '../../types/dashboard';
import { Member, AddTaskModalProps } from '../../types/join-space';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  showInput,
  title,
  task,
  priority,
  deadline,
  setTitle,
  setTask,
  setPriority,
  handleAddTask,
  setShowInput,
  members,
  assignedTo,
  setAssignedTo,
  setDeadline,
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showEmptyError, setShowEmptyError] = useState(false);
  const [localAssignedTo, setLocalAssignedTo] = useState<string | null>(null);
  const effectiveAssignedTo = typeof assignedTo !== 'undefined' ? assignedTo : localAssignedTo;
  const effectiveSetAssignedTo = typeof setAssignedTo !== 'undefined' ? setAssignedTo : setLocalAssignedTo;

  if (!showInput) return null;

  const handleTextareaScroll = () => {
    setIsScrolling(true);
    
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    const newTimeout = setTimeout(() => {
      setIsScrolling(false);
    }, 1500);
    
    setScrollTimeout(newTimeout);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task.trim()) {
      setShowEmptyError(true);
      return;
    }
    setShowEmptyError(false);
  handleAddTask(e, effectiveAssignedTo ?? null);
  };

  const getPriorityIcon = (priorityLevel: Priority) => {
    switch (priorityLevel) {
      case 'high':
        return <Zap size={16} className="text-red-400" />;
      case 'moderate':
        return <AlertCircle size={16} className="text-yellow-400" />;
      case 'low':
        return <Clock size={16} className="text-green-400" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 animate-fadeIn overflow-hidden p-2 sm:p-4"
      onClick={() => setShowInput(false)}
    >
      <div className="w-full p-2 sm:p-4 max-w-2xl mx-auto animate-scaleInLarger overflow-hidden max-h-[95vh] sm:max-h-full">
        <div 
          className="bg-slate-700 rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl w-full backdrop-blur-sm bg-opacity-90 transform transition-all duration-300 hover:shadow-2xl overflow-auto border border-white/10"
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Header with close button */}
          <div className="flex justify-center items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 font-poppins text-center">
              What's your plan for today?
            </h2>
          </div>

          <form onSubmit={handleFormSubmit}>
            {/* Title Input (Optional) - Hidden during scroll */}
            <div className={`transition-all duration-300 mb-3 sm:mb-4 ${isScrolling ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
              <input
                type="text"
                className="w-full p-3 sm:p-4 rounded-lg text-center text-white bg-white/10 focus:outline-none border-2 border-white/20 focus:border-white/40 text-lg sm:text-xl font-bold font-poppins placeholder:text-white/50 backdrop-blur-sm transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title (optional)..."
              />
            </div>

            {/* Only show assign dropdown if members prop is provided (space page) */}
            {typeof members !== 'undefined' && Array.isArray(members) && members.length > 0 && (
              <select
                value={effectiveAssignedTo ?? ""}
                onChange={e => effectiveSetAssignedTo(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-800 text-white mb-3 p-2 px-2 font-poppins"
              >
                <option value="">Assign to...</option>
                {members.map((member: Member) => {
                  // Safely cast tbl_users to expected shape
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
              className={`w-full p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 resize-none text-white bg-transparent focus:outline-none border-0 text-sm sm:text-base md:text-lg font-bold leading-relaxed overflow-auto no-scrollbar font-poppins placeholder:text-white/50 transition-all duration-300 ${
                isScrolling ? 'h-[200px] sm:h-[300px]' : 'h-32 sm:h-48 md:h-60'
              } ${showEmptyError ? 'border-2 border-red-400' : ''}`}
              value={task}
              onChange={(e) => {
                setTask(e.target.value);
                if (showEmptyError && e.target.value.trim()) setShowEmptyError(false);
              }}
              onScroll={handleTextareaScroll}
              placeholder={showEmptyError ? 'Please enter your task details before adding.' : 'Enter your task details...'}
              autoFocus
            />
            {/* Priority Selection - Hidden during scroll */}
            <div className={`transition-all duration-300 mb-3 sm:mb-4 ${isScrolling ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
              <label className="block text-sm sm:text-base font-semibold text-white/90 mb-2 sm:mb-3 font-poppins">Priority Level</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('low')}
                  className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 font-poppins flex items-center justify-center gap-2 ${
                    priority === 'low'
                      ? 'bg-green-500/30 border-green-400 text-green-300 shadow-lg scale-105'
                      : 'bg-white/10 border-white/20 text-white/70 hover:border-green-400 hover:bg-green-500/20 hover:text-green-300'
                  }`}
                >
                  <Clock size={16} className="sm:hidden" />
                  <Clock size={18} className="hidden sm:block" />
                  <span className="font-medium text-sm sm:text-base">Low Priority</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('moderate')}
                  className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 font-poppins flex items-center justify-center gap-2 ${
                    priority === 'moderate'
                      ? 'bg-yellow-500/30 border-yellow-400 text-yellow-300 shadow-lg scale-105'
                      : 'bg-white/10 border-white/20 text-white/70 hover:border-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300'
                  }`}
                >
                  <AlertCircle size={16} className="sm:hidden" />
                  <AlertCircle size={18} className="hidden sm:block" />
                  <span className="font-medium text-sm sm:text-base">Moderate Priority</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('high')}
                  className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 font-poppins flex items-center justify-center gap-2 ${
                    priority === 'high'
                      ? 'bg-red-500/30 border-red-400 text-red-300 shadow-lg scale-105'
                      : 'bg-white/10 border-white/20 text-white/70 hover:border-red-400 hover:bg-red-500/20 hover:text-red-300'
                  }`}
                >
                  <Zap size={16} className="sm:hidden" />
                  <Zap size={18} className="hidden sm:block" />
                  <span className="font-medium text-sm sm:text-base">High Priority</span>
                </button>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
              <div className="w-full sm:w-full md:w-[280px] flex items-center bg-black/20 px-2 py-1 rounded-lg mr-2 relative">
                <Clock size={18} className="text-white mr-1 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <DatePicker
                  selected={deadline}
                  onChange={(date) => setDeadline(date)}
                  className="w-full text-start p-2 rounded-lg bg-transparent text-white font-poppins pl-8 border-0 focus:outline-none"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Set a deadline"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowInput(false)}
                className="text-slate-700 hover:text-slate-900 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/80 hover:bg-white/90 transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20 font-poppins font-medium order-2 sm:order-1 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 hover:from-sky-600 hover:via-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg backdrop-blur-sm border border-white/20 font-poppins font-medium flex items-center justify-center gap-2 order-1 sm:order-2 text-sm sm:text-base"
              >
                <Rocket size={16} className="sm:hidden" />
                <Rocket size={18} className="hidden sm:block" />
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
