"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { FaSearch, FaBell, FaUserCircle, FaSignOutAlt, FaBars } from "react-icons/fa";

export default function DashboardNavbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left Section - Brand & Mobile Menu */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button (Only visible on small screens) */}
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <FaBars className="h-5 w-5" />
        </button>
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-amber-500 font-bold text-xl">Bazzar</span>
          <span className="text-gray-400 text-xs hidden sm:inline">Dashboard</span>
        </div>
      </div>

      {/* Middle Section - Search Bar */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative text-gray-400 hover:text-white">
          <FaBell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
              U
            </div>
            <span className="hidden md:inline">Admin</span>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg py-1 z-50">
              <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white">
                <FaUserCircle className="inline mr-2" /> Profile
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white">
                <FaUserCircle className="inline mr-2" /> Settings
              </a>
              <hr className="border-gray-600 my-1" />
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 hover:text-red-300"
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}