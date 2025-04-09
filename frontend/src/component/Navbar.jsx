// Navbar.jsx
import React from 'react';
import { FaEnvelope, FaBell, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  return (
    <div className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 z-10 h-14 flex justify-between items-center px-6">
      <span className="text-xl font-medium">Candidates</span>
      <div className="flex items-center space-x-4">
        <FaEnvelope className="text-gray-700 cursor-pointer" />
        <FaBell className="text-gray-700 cursor-pointer" />
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img src="/placeholder.svg?height=32&width=32" alt="Profile" className="w-8 h-8 rounded-full" />
          </div>
          <FaChevronDown className="ml-2 w-4 h-4 text-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;