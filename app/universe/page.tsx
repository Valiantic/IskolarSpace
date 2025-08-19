'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import DeepSpaceBackground from '../components/UniverseBlocks/DeepSpaceBackground'
import CosmicArrowButton from '../components/UniverseBlocks/CosmicArrowButton'
import AddNoteButton from '../components/UniverseBlocks/AddNoteButton'
import AddNoteModal from '../components/UniverseBlocks/AddNoteModal'
import EditNoteModal from '../components/UniverseBlocks/EditNoteModal'
import FloatingNoteBubble from '../components/UniverseBlocks/FloatingNoteBubble'
import { useAuth } from '../hooks/auth/useAuth'
import { supabase } from '../../lib/supabaseClient'
import { SpaceNote } from '../types/universe'

const SpacePage = () => {
  const { user, authLoading, requireAuth } = useAuth()
  const [notes, setNotes] = useState<SpaceNote[]>([])
  const [userNote, setUserNote] = useState<SpaceNote | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notesLoading, setNotesLoading] = useState(true)


  // Auth guard
  useEffect(() => {
    if (!authLoading) {
      requireAuth()
    }
  }, [authLoading, requireAuth])

  // Load notes on component mount and set up real-time subscription
  useEffect(() => {
    if (!user) return

    loadNotes()
    
    // Set up real-time subscription for notes
    const notesSubscription = supabase
      .channel('space_notes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'space_notes'
        },
        () => {
          loadNotes()
        }
      )
      .subscribe()

    // Clean up expired notes every minute
    const cleanupInterval = setInterval(() => {
      loadNotes()
    }, 60000)

    return () => {
      notesSubscription.unsubscribe()
      clearInterval(cleanupInterval)
    }
  }, [user])

  const loadNotes = async () => {
    try {
      // First get the notes
      const { data: notesData, error: notesError } = await supabase
        .from('space_notes')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })

      if (notesError) throw notesError

      // Get user full names and avatar URLs from profiles
      const userIds = [...new Set(notesData.map(note => note.user_id))]
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds)

      if (usersError) {
        console.warn('Could not load users from profiles:', usersError)
      }

      // Merge the data so every note has display_name and avatar_url
      const formattedNotes = notesData.map(note => {
        const userRecord = usersData?.find(u => u.id === note.user_id)
        const displayName = userRecord?.full_name || 'Anonymous'
        const avatarUrl = userRecord?.avatar_url || null
        return {
          ...note,
          display_name: displayName,
          avatar_url: avatarUrl
        }
      })

      setNotes(formattedNotes)

      // Find current user's note
      const currentUserNote = formattedNotes.find(note => note.user_id === user?.id)
      setUserNote(currentUserNote || null)
    } catch (error) {
      console.error('Error loading notes:', error)
      toast.error('Failed to load space notes')
    } finally {
      setNotesLoading(false)
    }
  }

  const generateRandomPosition = () => {
    const padding = 150
    const bubbleRadius = 125 // Approximate radius of the bubble (half of max-width)
    const minDistance = bubbleRadius * 2.2 // Minimum distance between bubble centers
    let attempts = 0
    const maxAttempts = 50

    const generateCoordinate = () => ({
      x: Math.random() * (window.innerWidth - 2 * padding) + padding,
      y: Math.random() * (window.innerHeight - 2 * padding) + padding
    })

    let position = generateCoordinate()

    // Check for collisions with existing notes
    while (attempts < maxAttempts) {
      let hasCollision = false
      
      for (const existingNote of notes) {
        const distance = Math.sqrt(
          Math.pow(position.x - existingNote.position.x, 2) + 
          Math.pow(position.y - existingNote.position.y, 2)
        )
        
        if (distance < minDistance) {
          hasCollision = true
          break
        }
      }

      if (!hasCollision) {
        break
      }

      position = generateCoordinate()
      attempts++
    }

    return position
  }

  const handleCreateNote = useCallback(async (content: string) => {
    
    if (!user) {
      console.error('🌌 No user found')
      toast.error('User not authenticated')
      return
    }

    setIsLoading(true)
    
    try {
      const position = generateRandomPosition()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      const noteData = {
        user_id: user.id,
        content,
        position,
        expires_at: expiresAt.toISOString()
      }
      
      const { data, error } = await supabase
        .from('space_notes')
        .insert(noteData)
        .select()

      if (error) {
        console.error('🌌 Supabase error:', error)
        throw error
      }

      toast.success('Space note launched! 🚀')
      setIsAddModalOpen(false)
      loadNotes()
    } catch (error) {
      console.error('🌌 Error creating note:', error)
      toast.error('Failed to create space note: ' + (error as any)?.message)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const handleUpdateNote = async (content: string) => {
    if (!userNote) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('space_notes')
        .update({ content })
        .eq('id', userNote.id)

      if (error) throw error

      toast.success('Space note updated! ✨')
      setIsEditModalOpen(false)
      loadNotes()
    } catch (error) {
      console.error('Error updating note:', error)
      toast.error('Failed to update space note')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNote = async () => {
    if (!userNote) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('space_notes')
        .delete()
        .eq('id', userNote.id)

      if (error) throw error

      toast.success('Space note deleted')
      setIsEditModalOpen(false)
      loadNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error('Failed to delete space note')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false)
  }, [])

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true)
  }, [])

  // Don't render anything while checking auth
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <div className="relative min-h-screen">
        <DeepSpaceBackground />
        
        {/* Floating Notes */}
        {!notesLoading && notes.map((note) => (
          <FloatingNoteBubble
            key={note.id}
            note={note}
            allNotes={notes}
            onEdit={() => setIsEditModalOpen(true)}
            isOwner={note.user_id === user.id}
          />
        ))}

        {/* Add Note Button - Only show if user doesn't have an active note */}
        {!userNote && (
          <AddNoteButton onClick={handleOpenAddModal} />
        )}

        {/* Cosmic Arrow Button pointing to My Space (Dashboard) */}
        <CosmicArrowButton 
          href="/dashboard" 
          label="My Space" 
          position="bottom-center"
        />

        {/* Modals */}
        <AddNoteModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onSave={handleCreateNote}
          isLoading={isLoading}
        />

        <EditNoteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateNote}
          onDelete={handleDeleteNote}
          initialContent={userNote?.content || ''}
          isLoading={isLoading}
        />
      </div>
    </>
  )
}

export default SpacePage
