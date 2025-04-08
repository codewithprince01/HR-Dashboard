import React from "react";

const Button = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ backgroundColor: "#4D007D" }}
      className={`px-10 py-1.5 text-white rounded-full hover:bg-purple-800 transition duration-300 shadow-lg text-xl focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
