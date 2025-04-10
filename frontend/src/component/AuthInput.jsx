import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const wrapperStyle = {
  marginBottom: '1rem',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
  marginBottom: '0.25rem',
};

const requiredStyle = {
  color: 'red',
  marginLeft: '0.25rem',
};

const inputRelativeStyle = {
  position: 'relative',
};

const inputFieldStyle = {
  width: '100%',
  padding: '0.875rem 1rem',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '0.875rem',
  outline: 'none',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
};

const eyeIconStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#4D007D',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};

const AuthInput = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  required,
  minLength
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div style={wrapperStyle}>
      <label style={labelStyle}>
        {label}
        {required && <span style={requiredStyle}>*</span>}
      </label>
      <div style={inputRelativeStyle}>
        <input
          type={isPasswordField && showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          style={inputFieldStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#4D007D';
            e.target.style.boxShadow = '0 0 0 2px rgba(77, 0, 125, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
          }}
        />
        {isPasswordField && (
          <span style={eyeIconStyle} onClick={toggleVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
    </div>
  );
};

export default AuthInput;