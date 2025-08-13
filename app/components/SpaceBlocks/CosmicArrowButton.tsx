'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import { CosmicArrowButtonProps } from '../../types/space'

const CosmicArrowButton: React.FC<CosmicArrowButtonProps> = ({
  href,
  label,
  className = '',
  position = 'bottom-center'
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4 sm:bottom-8 sm:left-8'
      case 'bottom-right':
        return 'bottom-4 right-4 sm:bottom-8 sm:right-8'
      case 'bottom-center':
      default:
        return 'bottom-4 left-1/2 transform -translate-x-1/2 sm:bottom-8'
    }
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-20 ${className}`}>
      <Link href={href}>
        <button className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 text-white p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/50">
          {/* Cosmic glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          
          {/* Sparkle effects */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-3 right-2 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse delay-700"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-blue-300 rounded-full animate-ping delay-500"></div>
          </div>
          
          {/* Arrow icon */}
          <ArrowDown 
            size={24} 
            className="relative z-10 transform group-hover:translate-y-1 transition-transform duration-300 sm:w-7 sm:h-7" 
          />
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-1 bg-slate-900/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap backdrop-blur-sm border border-cyan-500/30">
            {label}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900/90"></div>
          </div>
        </button>
      </Link>
    </div>
  )
}

export default CosmicArrowButton
