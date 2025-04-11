import React from "react";

const buttonStyle = {
  width: '150px', 
  padding: '0.5rem 1rem',
  backgroundColor: '#4D007D',
  color: 'white',
  borderRadius: '9999px',
  fontSize: '1rem',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s ease',
  cursor: 'pointer',
  outline: 'none',
  border: 'none',
  textAlign: 'center',
};

const Button = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        ...buttonStyle,
        ...(className && {}), 
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = '#6B21A8')}
      onMouseOut={(e) => (e.target.style.backgroundColor = '#4D007D')}
      onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px rgba(168, 85, 247, 0.5)')}
      onBlur={(e) => (e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)')}
    >
      {children}
    </button>
  );
};

export default Button;