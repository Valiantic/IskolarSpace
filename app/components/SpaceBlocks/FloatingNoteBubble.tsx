'use client'

import React, { useState, useEffect } from 'react'
import { Edit3, Clock } from 'lucide-react'
import { FloatingNoteBubbleProps } from '../../types/space'

const FloatingNoteBubble: React.FC<FloatingNoteBubbleProps> = ({
  note,
  allNotes,
  onEdit,
  isOwner
}) => {

  const [position, setPosition] = useState({ x: note.position.x, y: note.position.y })
  const [velocity, setVelocity] = useState({ 
    x: (Math.random() - 0.5) * 0.5, 
    y: (Math.random() - 0.5) * 0.5 
  })
  const [lastVelocityUpdate, setLastVelocityUpdate] = useState(Date.now())

  // Calculate time remaining
  const getTimeRemaining = () => {
    const now = new Date().getTime()
    const expiresAt = new Date(note.expires_at).getTime()
    const timeLeft = Math.max(0, expiresAt - now)
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    return { hoursLeft, minutesLeft, timeLeft }
  }

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining())

  // Update time remaining every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [note.expires_at])

  // Sync position to database occasionally (throttled to prevent spam)
  useEffect(() => {
    const syncPosition = async () => {
      // Only sync if position has changed significantly and enough time has passed
      const positionChanged = Math.abs(position.x - note.position.x) > 10 || 
                            Math.abs(position.y - note.position.y) > 10
      const timeSinceLastUpdate = Date.now() - lastVelocityUpdate
      
      if (positionChanged && timeSinceLastUpdate > 5000) { // 5 second throttle
        try {
          const { supabase } = await import('../../../lib/supabaseClient')
          await supabase
            .from('space_notes')
            .update({ position: { x: position.x, y: position.y } })
            .eq('id', note.id)
          setLastVelocityUpdate(Date.now())
        } catch (error) {
          console.warn('Failed to sync bubble position:', error)
        }
      }
    }

    const syncInterval = setInterval(syncPosition, 5000) // Check every 5 seconds
    return () => clearInterval(syncInterval)
  }, [position, note.id, note.position.x, note.position.y, lastVelocityUpdate])

  // Floating animation with collision detection
  useEffect(() => {
    const animate = () => {
      setPosition(prev => {
        let newX = prev.x + velocity.x
        let newY = prev.y + velocity.y
        
        // Constants for collision detection
        const bubbleRadius = 125 // Approximate radius of the bubble
        const minDistance = bubbleRadius * 1.8 // Minimum distance between bubble centers
        const padding = 100

        // Check collision with other bubbles
        const otherNotes = allNotes.filter(n => n.id !== note.id)
        let hasCollision = false
        
        for (const otherNote of otherNotes) {
          const distance = Math.sqrt(
            Math.pow(newX - otherNote.position.x, 2) + 
            Math.pow(newY - otherNote.position.y, 2)
          )
          
          if (distance < minDistance) {
            hasCollision = true
            // Calculate repulsion direction
            const dx = newX - otherNote.position.x
            const dy = newY - otherNote.position.y
            const angle = Math.atan2(dy, dx)
            
            // Apply repulsion force by modifying velocity
            const repulsionForce = 0.4
            const randomOffset = (Math.random() - 0.5) * 0.2 // Add randomness to prevent sticking
            setVelocity(v => ({
              x: v.x + (Math.cos(angle) * repulsionForce) + randomOffset,
              y: v.y + (Math.sin(angle) * repulsionForce) + randomOffset
            }))
            
            // Move bubble away from collision point
            const pushDistance = minDistance - distance + 5
            newX += Math.cos(angle) * pushDistance * 0.1
            newY += Math.sin(angle) * pushDistance * 0.1
            break
          }
        }

        // Bounce off screen edges (with some padding)
        if (newX <= padding || newX >= window.innerWidth - padding) {
          setVelocity(v => ({ ...v, x: -v.x * 0.8 })) // Add some damping
          newX = Math.max(padding, Math.min(window.innerWidth - padding, newX))
        }
        if (newY <= padding || newY >= window.innerHeight - padding) {
          setVelocity(v => ({ ...v, y: -v.y * 0.8 })) // Add some damping
          newY = Math.max(padding, Math.min(window.innerHeight - padding, newY))
        }

        // Limit velocity to prevent excessive speed
        setVelocity(v => ({
          x: Math.max(-2, Math.min(2, v.x)),
          y: Math.max(-2, Math.min(2, v.y))
        }))

        return { x: newX, y: newY }
      })
    }

    const animationFrame = setInterval(animate, 50) // 20 FPS for smooth movement
    return () => clearInterval(animationFrame)
  }, [velocity, allNotes, note.id])

  // Don't render if expired
  if (timeRemaining.timeLeft <= 0) {
    return null
  }

  const formatTimeRemaining = () => {
    if (timeRemaining.hoursLeft > 0) {
      return `${timeRemaining.hoursLeft}h ${timeRemaining.minutesLeft}m`
    }
    return `${timeRemaining.minutesLeft}m`
  }

  return (
    <div
      className="fixed z-30 group cursor-pointer"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={isOwner ? onEdit : undefined}
    >
      {/* Main bubble */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-cyan-400/30 rounded-full blur-lg scale-100"></div>
        
        {/* Bubble container */}
        <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-700/90 border border-cyan-400/50 rounded-full p-4 backdrop-blur-sm min-w-[200px] max-w-[250px] shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 group-hover:scale-110">
          {/* User avatar and display name */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {note.display_name ? note.display_name.charAt(0).toUpperCase() : 
               note.user_email ? note.user_email.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Display Name */}
              <div className="text-cyan-300 text-xs font-medium mb-1 truncate">
                {note.display_name || 'Anonymous'}
              </div>
              
              {/* Note content */}
              <p className="text-white text-sm sm:text-sm lg:text-base xl:text-sm leading-relaxed break-words">
                {note.content}
              </p>
              
              {/* Time remaining */}
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <Clock size={10} />
                <span>{formatTimeRemaining()}</span>
                {isOwner && (
                  <>
                    <span className="mx-1">•</span>
                    <Edit3 size={10} />
                    <span>Edit</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sparkle effects */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-50"></div>
          <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-purple-400 rounded-full"></div>
          
          {/* Owner indicator */}
          {isOwner && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          )}
        </div>

        {/* Floating particles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-ping delay-100"></div>
          <div className="absolute bottom-3 right-3 w-0.5 h-0.5 bg-purple-300 rounded-full delay-300"></div>
          <div className="absolute top-1/2 right-1 w-0.5 h-0.5 bg-blue-300 rounded-full animate-ping delay-500"></div>
        </div>
      </div>
    </div>
  )
}

export default FloatingNoteBubble
