import React from 'react'
import Image from 'next/image'
import NotesFeature from '../../../public/images/notes-feature.png'

const NotesFeatureHighlight = () => {
  return ( 
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center p-6 sm:p-12'>
      <Image
        src={NotesFeature}
        alt="Notes Feature"
        className="w-full h-auto rounded-lg"
      />
    </div>    
  )
}

export default NotesFeatureHighlight
