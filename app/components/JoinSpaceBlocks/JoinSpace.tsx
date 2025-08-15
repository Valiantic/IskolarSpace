"use client";
import React from 'react'
import Image from 'next/image'
import JoinSpaceImg from '../../../public/images/JoinSpace.png';

const JoinSpace = () => {
  return (
  <div className='flex mt-20 bg-black/30 rounded-xl outline-none focus:outline-none focus:ring-0 p-2 sm:p-2 md:p-7 lg:p-8 flex-col items-center justify-center mx-auto h-full'>
     <div className="w-32 sm:w-40 md:w-48 lg:w-56 relative h-auto">
        <Image src={JoinSpaceImg} className='object-contain' alt="Join Space" />
     </div>
        
        <div className='flex flex-col items-center justify-center h-full gap-4 px-2 py-2'>
          <h1 className='font-bold font-poppins text-white text-sm sm:text-lg md:text-xl lg:text-4xl'>Join a Space!</h1>
           <p className="text-gray-300 text-center max-w-md sm:max-w-lg md:max-w-xl mx-auto mb- sm:mb-4 text-sm sm:text-xs md:text-lg leading-relaxed px-2">
            Welcome to Join A Space where you can collaborate, assign task and 
            build the future with other Students!
           </p>
        </div>

        <div className="flex items-center bg-[#1c2a4d] rounded-full px-4 sm:px-4 md:px-6 sm:py-4 md:py-5 min-w-0 w-full mb-2">
          <input
            type="text"
            placeholder="Enter code..."
            className="flex-1 min-w-0 w-full bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-0 border-none"
          />
          <button className="ml-4 bg-blue-400 hover:bg-blue-500 text-white font-semibold px-6 sm:px-6 py-2 md:py-2 rounded-full">
            Join
          </button>
        </div>
   </div>
  )
}

export default JoinSpace
