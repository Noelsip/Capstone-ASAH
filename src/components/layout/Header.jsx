import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); 
  const navigate = useNavigate(); 

  const user = {
    name: 'Orang Asing',
    title: 'Chemical Engineer',
    initials: 'OA'
  };

  const handleNotificationClick = () => {
      // TODO: Nanti ini akan membuka panel notifikasi/modal
      alert("Menampilkan daftar notifikasi (Fungsionalitas Belum Diimplementasikan)");
  };
  
  const handleProfileSettingsClick = () => {
      setIsMenuOpen(false); 
      navigate('/settings'); // Navigasi ke halaman Personal Settings
  }

  const handleLogout = () => {
      setIsMenuOpen(false); 
      // TODO: Logika pembersihan token atau sesi akan dilakukan di sini
      navigate('/login'); // Redirect/Mengarahkan ke halaman login
  };

  return (
    <header className="h-20 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
      
      {}
      <div className="flex items-center space-x-4">
        <button 
            className="md:hidden p-2 text-gray-500 hover:text-primary"
            onClick={() => setIsSidebarVisible(!isSidebarVisible)} 
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>
        
        {}
        <span className="md:hidden text-lg font-semibold text-gray-800">Dashboard</span>
        
        {/* Desktop Title (Untuk memastikan ada ruang di kiri Header) */}
        <h1 className="text-xl font-semibold text-gray-900 hidden md:block">
            Dashboard
        </h1>
      </div>
      
      {}
      <div className="flex items-center space-x-6 relative">
        
        {/* Tombol Notifikasi (Lonceng) - Harusnya memunculkan catatan */}
        <button 
            className="text-gray-500 hover:text-primary transition-colors relative"
            onClick={handleNotificationClick}
        >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.36 6 8.304 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {}
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
        </button>

        {/* Info Profil dan Avatar - Memicu Dropdown */}
        <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle Dropdown
        >
            <div className="text-right hidden md:block"> {}
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.title}</p>
            </div>
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {user.initials}
            </div>
        </div>
        
        {/* Dropdown Menu */}
        {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-100">
                
                {}
                <button 
                    onClick={handleProfileSettingsClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    Profile Settings
                </button>
                
                {/* 2. Log Out -> Ke /login */}
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    Log Out
                </button>
            </div>
        )}
      </div>
    </header>
  );
}

export default Header;