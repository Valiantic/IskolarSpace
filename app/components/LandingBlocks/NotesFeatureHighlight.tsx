import React from 'react'
import Image from 'next/image'
import NotesFeature from '../../../public/images/notes-feature.png'

const NotesFeatureHighlight = () => {
  return ( 
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative'>
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-emerald-500/10 blur-[100px] rounded-full point-events-none z-0" />
        
      <div className="relative z-10 rounded-2xl border border-white/10 bg-[#09090b]/40 p-3 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 ring-1 ring-white/5">
        {/* Screen Mockup Top Bar */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex gap-2 text-slate-500 text-xs uppercase tracking-widest font-bold">
            Notes Database
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-xl border border-white/10 w-full relative group bg-black">
          <Image
            src={NotesFeature}
            alt="Notes Feature"
            className="w-full h-auto object-cover transform duration-700 group-hover:scale-[1.03] opacity-90 group-hover:opacity-100"
          />
        </div>
      </div>
    </div>    
  )
}

export default NotesFeatureHighlight
