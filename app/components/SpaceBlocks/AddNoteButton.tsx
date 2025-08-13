'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'

interface AddNoteButtonProps {
  onClick: () => void
  className?: string
}

const AddNoteButton: React.FC<AddNoteButtonProps> = ({ 
  onClick, 
  className = '' 
}) => {
  return (
    <div className={`fixed bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 z-20 px-4 sm:px-0 ${className}`}>
      <button 
        onClick={onClick}
        className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/50 text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none"
      >
        {/* Cosmic glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        
        {/* Sparkle effects */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-2 right-3 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-2 left-4 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-blue-300 rounded-full animate-ping delay-500"></div>
        </div>
        
        {/* Button content */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          <span className="font-medium text-center">
            <span className="hidden sm:inline">Share a thought in Space!</span>
            <span className="sm:hidden">Share in Space!</span>
          </span>
          <Sparkles size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-1 bg-slate-900/90 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap backdrop-blur-sm border border-cyan-500/30 hidden sm:block">
          What's on your mind, astronaut?
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900/90"></div>
        </div>
      </button>
    </div>
  )
}

export default AddNoteButton
