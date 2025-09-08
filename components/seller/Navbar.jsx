'use client'
import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    } else {
      setIsLoggedIn(false)
      setUser(null)
    }
  }, [])

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    router.push('/')
  }

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
        {isLoggedIn ? (
          <>
            {/* User is logged in - show user info and logout button */}
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Hello, {user.fullName}
                </span>
                {user.avatar && (
                  <img 
                    src={user.avatar} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </div>
            )}
            <button 
              onClick={handleLogout}
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