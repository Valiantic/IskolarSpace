import React from 'react'
import Image from 'next/image'  
import Logo from '../../../public/svgs/iskolarspace_logo.svg'

const Footer = () => {
  return (
    <footer className="bg-gray-50">
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex justify-center text-teal-600 sm:justify-start">
            <Image src={Logo} alt="IskolarSpace Logo" width={40} height={40} />
            <h1 className='text-4xl font-semibold z-20 text-sky-500 text-transparent bg-clip-text'>IskolarSpace</h1>
        </div>

        <p className='mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right'>
            Developed and Designed by Steven Madali
        </p>
  
        <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
          Copyright &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
  )
}

export default Footer
