// src/components/common/Button.jsx
import React from 'react';

function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      // PERUBAHAN: Mengganti 'bg-blue-600' menjadi 'bg-primary' dan 'hover:bg-primary-hover'
      className={`w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold 
      hover:bg-primary-hover transition-colors duration-200 
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;