import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
    <div className="mb-3">
      <label className="text-sm font-medium text-gray-700 block mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={isPasswordField && showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          className="w-full px-3 py-3.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
        />
        {isPasswordField && (
          <span
            className="absolute inset-y-0 right-3 flex items-center text-purple-600 cursor-pointer"
            onClick={toggleVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
    </div>
  );
};

export default AuthInput;