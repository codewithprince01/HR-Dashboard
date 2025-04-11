import React from 'react';
import { FaUser, FaClock, FaCalendarAlt, FaSignOutAlt, FaSearch, FaUsers } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import '../style/sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
    
      <div className="logo-section">
        <div className="logo-icon">
          <div className="logo-inner-box"></div>
        </div>
        <span className="logo-text">LOGO</span>
      </div>

      <div className="search-bar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>
      </div>

      <nav className="menu">
        <ul className="menu-list">
          <li className="section-label">Recruitment</li>
          <li className="menu-item">
            <NavLink
              to="/candidates"
              className={({ isActive }) =>
                `menu-link ${isActive ? 'active' : ''}`
              }
            >
              <FaUser className="menu-icon" /> Candidates
            </NavLink>
          </li>

          <li className="section-label">Organization</li>
          <li className="menu-item">
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `menu-link ${isActive ? 'active' : ''}`
              }
            >
              <FaUsers  className="menu-icon" />  Employees
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink
              to="/attendence"
              className={({ isActive }) =>
                `menu-link ${isActive ? 'active' : ''}`
              }
            >
              <FaClock  className="menu-icon" /> Attendence
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink
              to="/leaves"
              className={({ isActive }) =>
                `menu-link ${isActive ? 'active' : ''}`
              }
            >
               <FaCalendarAlt  className="menu-icon" /> Leaves
            </NavLink>
          </li>

          <li className="section-label">Others</li>
          <li className="menu-item logout">
          <NavLink
              to="/logout"
              className={({ isActive }) =>
                `menu-link ${isActive ? 'active' : ''}`
              }
            >
             <FaSignOutAlt className="menu-icon text-gray-400" />  Logout
            </NavLink>
            
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
