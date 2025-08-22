'use client'
import React from 'react'
import { Sparkles } from 'lucide-react'

interface CreateSpaceButtonProps {
  onClick?: () => void;
}

const CreateSpaceButton: React.FC<CreateSpaceButtonProps> = ({ onClick }) => {
  return (
     <button 
        className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/50 text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none"
        onClick={onClick}
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
            <span>Create a Space!</span>
          </span>
          <Sparkles size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
        </div>
        
      </button>
  )
}

export default CreateSpaceButton
