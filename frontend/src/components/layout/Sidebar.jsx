// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';

// Data Navigasi Digabung: Semua link disatukan, Settings & Logout di bagian bawah
const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { name: 'Equipment', path: '/equipment', icon: '⚙️' },
  { name: 'Alerts', path: '/alerts', icon: '🚨' },
  { name: 'AI Chat', path: '/ai-assistant', icon: '🤖' },
  // --- Navigasi Bawah Dinaikkan ---
  { name: 'Personal Settings', path: '/settings', icon: '⚙️', isSettings: true }, 
  { name: 'Logout', path: '/login', icon: '🚪', isLogout: true },
];

function Sidebar() {
  return (
    // Container utama: Tambahkan 'hidden md:flex' untuk Mobile Responsiveness
    <div className="w-64 bg-sidebar text-white flex-col h-screen shadow-2xl hidden md:flex"> 
      
      {/* 1. Bagian Logo */}
      <div className="flex flex-col items-center justify-center h-20 border-b border-gray-700">
        <span className="text-4xl font-black text-purple" aria-hidden="true">
          &gt;
        </span>
        <h1 className="text-4xl font-sans font-bold text-black tracking-wider">
          accenture
        </h1>
      </div>

      {/* 2. Navigasi Utama yang Digabung (Semua Link) */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          // Logika untuk menampilkan garis pemisah sebelum Personal Settings
          if (item.isSettings) {
            return (
              <React.Fragment key={item.name}>
                {/* Garis Pemisah (Divider) */}
                <div className="pt-2 pb-4">
                  <hr className="border-t border-gray-600" />
                </div>
                
                {/* Render NavLink untuk Settings */}
                <NavLink 
                    to={item.path} 
                    className={({ isActive }) => 
                        `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 
                        ${isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                    }
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </NavLink>
              </React.Fragment>
            );
          }
          
          // Render item navigasi biasa
          return (
            <NavLink 
                key={item.name} 
                to={item.path} 
                className={({ isActive }) => 
                    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 
                    ${isActive ? 'bg-primary text-white shadow-lg' : 
                    (item.isLogout ? 'text-red-300 hover:bg-gray-700 hover:text-red-100' : 'text-gray-300 hover:bg-gray-700 hover:text-white')
                    }`
                }
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;