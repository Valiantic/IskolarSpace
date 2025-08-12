'use client'

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

interface Todo {
  id: string;
  title?: string;
  content: string;
  user_id: string;
  created_at: string;
  priority: 'low' | 'moderate' | 'high';
}

interface EditTaskModalProps {
  editingTaskId: string | null;
  todos: Todo[];
  editedContent: string;
  editedTitle: string;
  editedPriority: 'low' | 'moderate' | 'high';
  setEditedContent: (content: string) => void;
  setEditedTitle: (title: string) => void;
  setEditedPriority: (priority: 'low' | 'moderate' | 'high') => void;
  handleSaveEdit: (todoId: string) => void;
  cancelEditing: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  editingTaskId,
  todos,
  editedContent,
  editedTitle,
  editedPriority,
  setEditedContent,
  setEditedTitle,
  setEditedPriority,
  handleSaveEdit,
  cancelEditing,
}) => {
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
          
          {/* Priority Selection in Edit Mode - Hidden during scroll */}
          <div className={`mb-6 transition-all duration-300 ${isScrolling ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <label className="block text-sm font-medium text-white/90 mb-3 font-poppins">Priority Level</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setEditedPriority('low')}
                className={`p-3 rounded-lg border-2 transition-all font-poppins backdrop-blur-sm ${
                  editedPriority === 'low'
                    ? 'bg-green-500/30 border-green-300 text-green-100'
                    : 'bg-white/10 border-white/20 text-white/80 hover:border-green-300 hover:bg-green-500/20'
                }`}
              >
                Low Priority
              </button>
              <button
                type="button"
                onClick={() => setEditedPriority('moderate')}
                className={`p-3 rounded-lg border-2 transition-all font-poppins backdrop-blur-sm ${
                  editedPriority === 'moderate'
                    ? 'bg-yellow-500/30 border-yellow-300 text-yellow-100'
                    : 'bg-white/10 border-white/20 text-white/80 hover:border-yellow-300 hover:bg-yellow-500/20'
                }`}
              >
                Moderate Priority
              </button>
              <button
                type="button"
                onClick={() => setEditedPriority('high')}
                className={`p-3 rounded-lg border-2 transition-all font-poppins backdrop-blur-sm ${
                  editedPriority === 'high'
                    ? 'bg-red-500/30 border-red-300 text-red-100'
                    : 'bg-white/10 border-white/20 text-white/80 hover:border-red-300 hover:bg-red-500/20'
                }`}
              >
                High Priority
              </button>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end mt-6">
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
