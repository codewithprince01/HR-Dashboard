import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaEnvelope, FaBell, FaChevronDown } from "react-icons/fa";


const pathTitleMap = {
  "/candidates": "Candidates",
  "/employees": "Employees",
  "/attendence": "Attendance",
  "/leaves": "Leaves",
  "/logout": "Logout",
};

const navbarStyle = {
  position: 'fixed',
  top: 0,
  left: '16rem',
  right: 0,
  backgroundColor: 'white',
  zIndex: 10,
  height: '3.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
};

const navbarTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '500',
};

const navbarIconsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const navbarIconStyle = {
  color: '#374151',
  cursor: 'pointer',
};

const profileBoxStyle = {
  position: 'relative',
  padding: '0.5rem',
  borderRadius: '0.5rem',
};

const profileToggleStyle = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
};

const profileAvatarStyle = {
  width: '2rem',
  height: '2rem',
  borderRadius: '9999px',
};

const chevronIconStyle = {
  marginLeft: '0.5rem',
  color: '#374151',
};

const dropdownMenuStyle = {
  position: 'absolute',
  top: '3.5rem',
  right: 0,
  background: 'white',
  boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
  borderRadius: '0.5rem',
  padding: '0.5rem 0',
  width: '12rem',
  zIndex: 50,
};

const dropdownItemStyle = {
  padding: '0.75rem 1rem',
  fontSize: '0.95rem',
  color: '#111827',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
};

const Navbar = () => {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const pageTitle = pathTitleMap[location.pathname] || "Dashboard";

  return (
    <div style={navbarStyle}>
      <span style={navbarTitleStyle}>{pageTitle}</span>
      <div style={navbarIconsStyle}>
        <FaEnvelope style={navbarIconStyle} />
        <FaBell style={navbarIconStyle} />

        <div style={profileBoxStyle}>
          <div
            style={profileToggleStyle}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              style={profileAvatarStyle}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <FaChevronDown style={chevronIconStyle} />
          </div>

          {showDropdown && (
            <div style={dropdownMenuStyle}>
              {["Edit Profile", "Change Password", "Manage Notification"].map((item, idx) => (
                <div
                  key={idx}
                  style={dropdownItemStyle}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
