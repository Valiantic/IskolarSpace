import React from 'react'
import Image from 'next/image'
import NoTaskImage from '../../public/images/NoTask.png'
import { Rocket } from 'lucide-react'

const NoTaskBanner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-slate-800 bg-opacity-60 p-8 rounded-2xl shadow-2xl border border-blue-400 backdrop-blur-sm max-w-2xl w-full animate-scaleIn">
        <div className="flex flex-col items-center">          <div className="animate-floating">
            <Image
              src={NoTaskImage}
              alt="No Tasks" 
              className="mx-auto w-64 h-auto md:w-80 drop-shadow-lg"
              priority
            />
          </div>
          
          <h2 className="text-3xl font-bold mt-6 text-center bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 text-transparent bg-clip-text">
            No tasks in your universe yet!
          </h2>
          
          <div className="mt-4 bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-500 border-opacity-30">
            <p className="text-blue-100 text-center text-lg">
              Begin your productivity journey by clicking the <span className="inline-flex items-center bg-blue-500 text-white rounded-full px-2 py-1 text-sm mx-1"> + </span> button on the below right side
            </p>
          </div>
          
          <div className="mt-6 flex gap-3">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="h-1 w-1 rounded-full bg-blue-400 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoTaskBanner
