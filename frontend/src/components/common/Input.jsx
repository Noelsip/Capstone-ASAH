// src/components/common/Input.jsx
import React from 'react';

// Kita akan meneruskan semua props HTML standar (type, value, onChange, placeholder)
// menggunakan '...props'
function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export default Input;