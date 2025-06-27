"use client"

import React, { useEffect } from 'react'
import SpaceBackground from './components/DashboardBlocks/SpaceBackground'
import Image from 'next/image'
import Notask from '../public/images/NoTask.png'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'

export default function NotFound() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session} } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth() 
  }, [])

  const handleReturn = () => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }



  return (
    <div className='relative min-h-screen'>
      <SpaceBackground />
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='text-center text-white p-8 rounded-lg bg-black/30 backdrop-blur-sm max-w-md'>
          <h1 className='text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text animate-pulse'>404</h1>
          <p className='text-2xl mb-6'>Page Not Found</p>
          <div className='relative w-64 h-64 mx-auto mb-6'>
            <Image 
              src={Notask} 
              alt="No Task" 
              fill
              className='object-contain animate-floating rounded-lg shadow-lg transition-transform duration-300 hover:scale-105'
            />
          </div>
          <p className='mb-6'>The page you are looking for does not exist or has been moved.</p>
         
           {loading ? (
            <button disabled className='inline-block px-6 py-3 bg-blue-400 rounded-full font-medium opacity-75'>
              <span className="animate-pulse">Loading...</span>
            </button>
          ) : (
            <button 
              onClick={handleReturn} 
              className='inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-300 font-medium'
            >
              Return {isAuthenticated ? 'to Dashboard' : 'Home'}
            </button>
          )}

        </div>
      </div>
    </div>
  )
}
