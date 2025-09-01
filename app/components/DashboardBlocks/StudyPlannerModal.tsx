'use client';

import React from 'react'
import { X, Sparkles, Sun, Moon, Calendar1, Rocket } from 'lucide-react';
import { StudyPlannerProps } from '../../types/dashboard';
import useStudyPlanner from '../../hooks/dashboard/useStudyPlanner';

const StudyPlanner: React.FC<StudyPlannerProps> = ({ isOpen, onClose }) => {
  const {
    content,
    isLoading,
    setContent,
    setIsLoading,
    handleClose,
    handleBackdropClick,
    selectedType,
    handleTypeClick
  } = useStudyPlanner({ onClose });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 w-full max-w-md mx-4 shadow-2xl backdrop-blur-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', zIndex: 1000 }}
      >
        {/* Cosmic glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl pointer-events-none"></div>

        {/* Content wrapper */}
        <div className="relative z-10">
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <h2 className="text-lg text-center sm:text-xl md:text-2xl font-bold text-white">AI Study Plan</h2>
              <Rocket size={14} className="text-cyan-400 sm:w-8 sm:h-8 " />
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              style={{ zIndex: 10 }}
            >
              <X size={18} className="text-gray-400 hover:text-white sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex items-center mt-2">
            <p className="text-lg font-poppins text-gray-300">
              Welcome to AI Study Planner! Let's create your task schedule to help your learning journey.
            </p>
          </div>

          <div className="flex justify-center items-center mt-2">
            <p className="text-lg font-poppins text-gray-300">
              Generate a Schedule for:
            </p>
          </div>

          <div className='flex gap-6 p-6 justify-center'>
            <button
              className={`w-40 h-35 rounded-full border-2 flex flex-col justify-center items-center p-6 transition-all duration-200 ${selectedType === 'day' ? 'border-cyan-400 bg-cyan-700 shadow-lg' : 'border-cyan-400 bg-transparent'}`}
              style={{ fontSize: '1.25rem' }}
              onClick={() => handleTypeClick('day')}
            >
              <Sun size={20} className={selectedType === 'day' ? 'text-white' : 'text-cyan-400'} />
              <span className="block text-base font-poppins text-white mt-3">Day</span>
            </button>
            <button
              className={`w-40 h-35 rounded-full border-2 flex flex-col justify-center items-center p-6 transition-all duration-200 ${selectedType === 'month' ? 'border-cyan-400 bg-cyan-700 shadow-lg' : 'border-cyan-400 bg-transparent'}`}
              style={{ fontSize: '1.25rem' }}
              onClick={() => handleTypeClick('month')}
            >
              <Moon size={20} className={selectedType === 'month' ? 'text-white' : 'text-cyan-400'} />
              <span className="block text-base font-poppins text-white mt-3">Week</span>
            </button>
            <button
              className={`w-40 h-35 rounded-full border-2 flex flex-col justify-center items-center p-6 transition-all duration-200 ${selectedType === 'year' ? 'border-cyan-400 bg-cyan-700 shadow-lg' : 'border-cyan-400 bg-transparent'}`}
              style={{ fontSize: '1.25rem' }}
              onClick={() => handleTypeClick('year')}
            >
              <Calendar1 size={20} className={selectedType === 'year' ? 'text-white' : 'text-cyan-400'} />
              <span className="block text-base font-poppins text-white mt-3">Month</span>
            </button>
          </div>

          <div className='flex justify-center mt-2'>
            <button className='font-poppins w-full text-xl sm:text-xl text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg py-2'>
              Generate Study Plan
              <Sparkles size={20} className="text-white inline-block ml-2" />
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

export default StudyPlanner;
