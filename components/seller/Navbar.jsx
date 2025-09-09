'use client'
import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {
  const { router, userData, logout } = useAppContext()

  const handleLogin = () => {
    router.push('/auth')
  }

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
      <Image 
        onClick={() => router.push('/')} 
        className='w-28 lg:w-32 cursor-pointer' 
        src={assets.logo} 
        alt="Website Logo" 
      />
      
      <div className="flex items-center gap-4">
        {userData ? (
          <>
            {/* User is logged in - show user info and logout button */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Hello, {userData.fullName}
              </span>
              {userData.avatar ? (
                <img 
                  src={userData.avatar} 
                  alt="User avatar" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm text-gray-600">
                    {userData.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <button 
              onClick={logout}
              className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-gray-700 transition-colors'
            >
              Logout
            </button>
          </>
        ) : (
          /* User is not logged in - show login button */
          <button 
            onClick={handleLogin}
            className='bg-orange-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-orange-700 transition-colors'
          >
            Login / Signup
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar