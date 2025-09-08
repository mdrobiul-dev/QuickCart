"use client"
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const userObj = JSON.parse(userData);
      setIsLoggedIn(true);
      setUser(userObj);
      setIsSeller(userObj.role === "admin" || userObj.role === "stuff");
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setIsSeller(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsSeller(false);
    router.push('/');
  };

  const handleAccountClick = () => {
    if (isLoggedIn) {
      // Navigate to user profile or dashboard based on role
      if (isSeller) {
        router.push('/seller');
      } else {
        router.push('/profile');
      }
    } else {
      // Navigate to login page
      router.push('/auth');
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && (
          <button 
            onClick={() => router.push('/seller')} 
            className="text-xs border px-4 py-1.5 rounded-full hover:bg-gray-50 transition"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4 cursor-pointer" src={assets.search_icon} alt="search icon" />
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* User is logged in - show user menu */}
              <div className="flex items-center gap-2">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm text-gray-600">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm hidden lg:block">
                  Hi, {user?.fullName?.split(' ')[0]}
                </span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="text-xs border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            /* User is not logged in - show login button */
            <button 
              onClick={() => router.push('/auth')}
              className="flex items-center gap-2 hover:text-gray-900 transition px-3 py-1.5 bg-orange-600 text-white rounded-full text-sm"
            >
              <Image src={assets.user_icon} alt="user icon" className="w-4 h-4" />
              Login
            </button>
          )}
        </div>
      </ul>

      {/* Mobile view */}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button 
            onClick={() => router.push('/seller')} 
            className="text-xs border px-3 py-1.5 rounded-full hover:bg-gray-50 transition"
          >
            Seller
          </button>
        )}
        
        <button 
          onClick={handleAccountClick}
          className="flex items-center gap-1 hover:text-gray-900 transition"
        >
          <Image src={assets.user_icon} alt="user icon" className="w-5 h-5" />
          {isLoggedIn && user?.avatar && (
            <img 
              src={user.avatar} 
              alt="User avatar" 
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;