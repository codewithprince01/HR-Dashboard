import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const cardStyle = {
  width: '500px',
  maxWidth: '90%',
  borderRadius: '20px',
  overflow: 'hidden',
  padding: '0',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
};

const headerStyle = {
  backgroundColor: '#4D007D',
  padding: '16px 24px',
  textAlign: 'center',
};

const headerTextStyle = {
  color: '#fff',
  fontSize: '1.125rem',
  fontWeight: '600',
};

const contentStyle = {
  textAlign: 'center',
  padding: '24px 0',
};

const contentTextStyle = {
  fontSize: '1rem',
  color: '#000',
  fontWeight: '500',
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  paddingBottom: '24px',
};

const cancelButtonStyle = {
  backgroundColor: '#4D007D',
  color: '#fff',
  padding: '8px 24px',
  borderRadius: '9999px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const logoutButtonStyle = {
  border: '1px solid #ef4444',
  color: '#ef4444',
  padding: '8px 24px',
  borderRadius: '9999px',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const overlayStyle = {
  position: 'fixed',
  inset: '0',
  zIndex: '50',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
};

const LogoutPopup = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:8080/api/users/logout',
        {},
        { withCredentials: true }
      );
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    navigate('/candidates');
  };

  if (!showPopup) return null;

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={headerTextStyle}>Log Out</h2>
        </div>

        <div style={contentStyle}>
          <p style={contentTextStyle}>Are you sure you want to log out?</p>
        </div>

        <div style={footerStyle}>
          <button
            onClick={handleCancel}
            style={cancelButtonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#3a0063')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#4D007D')}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            style={logoutButtonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#fee2e2')}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
