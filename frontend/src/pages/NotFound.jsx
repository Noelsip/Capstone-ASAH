// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-2xl text-gray-600 mb-4">Halaman Tidak Ditemukan</p>
      <Link to="/login" className="text-blue-600 hover:underline">
        Kembali ke Login
      </Link>
    </div>
  );
}

export default NotFoundPage; 
