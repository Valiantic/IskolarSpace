'use client'

import React, { useState } from 'react'
import { X, PenTool, Sparkles } from 'lucide-react'
import { AddNoteModalProps } from '../../types/space'

const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading
}) => {
  const [content, setContent] = useState('')
  const maxCharacters = 60

  if (!isOpen) return null

  const handleSave = () => {
    
    if (content.trim() && content.length <= maxCharacters) {
      onSave(content.trim())
      setContent('')
    } else {
      if (!content.trim()) {
        alert('Please enter some content for your space note!')
      } else if (content.length > maxCharacters) {
        alert(`Content is too long. Maximum ${maxCharacters} characters allowed.`)
      }
    }
  }

  const handleClose = () => {
    setContent('')
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

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
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-xs sm:text-sm md:text-sm lg:text-lg font-bold text-white">Share your thoughts to the Universe!</h2>
              <Sparkles size={14} className="text-cyan-400 sm:w-4 sm:h-4" />
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              style={{ zIndex: 10 }}
            >
              <X size={18} className="text-gray-400 hover:text-white sm:w-5 sm:h-5" />
            </button>
          </div>
          

          {/* Input area */}
          <div className="relative mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's floating through your mind, astronaut?"
              className="w-full h-24 sm:h-32 bg-slate-800/50 border border-cyan-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-gray-400 resize-none focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              maxLength={maxCharacters}
              disabled={isLoading}
              autoFocus
            />
            
            {/* Character counter */}
            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
              {content.length}/{maxCharacters}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              style={{ zIndex: 10, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading || !content.trim() || content.length > maxCharacters}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-cyan-500/25"
              style={{ zIndex: 10, cursor: isLoading || !content.trim() || content.length > maxCharacters ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                'Create Note'
              )}
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping pointer-events-none"></div>
        <div className="absolute bottom-2 right-8 w-0.5 h-0.5 bg-purple-400 rounded-full pointer-events-none"></div>
      </div>
    </div>
  )
}

export default AddNoteModal
