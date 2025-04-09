// Sidebar.jsx
import React from 'react';
import { FaUser, FaClock, FaCalendarAlt, FaSignOutAlt, FaSearch, FaUsers } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center p-4">
        <div className="w-8 h-8 bg-[#4d007d] flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white"></div>
        </div>
        <span className="ml-2 text-[#4d007d] font-bold text-lg">LOGO</span>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4d007d]"
          />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 mt-4">
        <ul className="space-y-2">
          <li className="px-4 py-2 text-gray-400 text-sm">
            Recruitment
          </li>
          
          <li className="px-4 py-2 text-[#4d007d] font-medium flex items-center">
          <NavLink
              to="/candidates"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md ${
                  isActive
                    ? 'text-[#4d007d] font-medium'
                    : 'text-gray-600 hover:text-[#4d007d]'
                }`
              }
            >
              <FaUser className="mr-3 w-5 h-5" /> Candidates
            </NavLink>
          </li>

          <li className="px-4 py-2 text-gray-400 text-sm mt-6">
            Organization
          </li>
          <li className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-[#4d007d] flex items-center">
          <NavLink
              to="/employees"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md ${
                  isActive
                    ? 'text-[#4d007d] font-medium'
                    : 'text-gray-600 hover:text-[#4d007d]'
                }`
              }
            >
              <FaUser className="mr-3 w-5 h-5" /> Employees
            </NavLink>
          </li>
          <li className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-[#4d007d] flex items-center">
          <NavLink
              to="/attendence"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md ${
                  isActive
                    ? 'text-[#4d007d] font-medium'
                    : 'text-gray-600 hover:text-[#4d007d]'
                }`
              }
            >
              <FaUser className="mr-3 w-5 h-5" /> Attendence
            </NavLink>          </li>
          <li className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-[#4d007d] flex items-center">
          <NavLink
              to="/leaves"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md ${
                  isActive
                    ? 'text-[#4d007d] font-medium'
                    : 'text-gray-600 hover:text-[#4d007d]'
                }`
              }
            >
              <FaUser className="mr-3 w-5 h-5" /> Leaves
            </NavLink> 
          </li>
          
          <li className="px-4 py-2 text-gray-400 text-sm mt-6">
            Others
          </li>
          <li className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-[#4d007d] flex items-center">
            <FaSignOutAlt className="mr-3 w-5 h-5 text-gray-400" /> Logout
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;