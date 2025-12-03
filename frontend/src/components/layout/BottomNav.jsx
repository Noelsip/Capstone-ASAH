// src/components/layout/BottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

// Data Navigasi Utama (diambil dari Sidebar)
const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Equipment', path: '/equipment', icon: '⚙️' },
    { name: 'Alerts', path: '/alerts', icon: '🚨' },
    { name: 'AI Chat', path: '/ai-assistant', icon: '🤖' },
];

function BottomNav() {
  return (
    // Fixed bottom bar - visible only on screens smaller than md
    <div className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 shadow-2xl 
                    flex justify-around items-center z-40 md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => 
            `flex flex-col items-center justify-center h-full text-xs font-medium transition-colors 
            ${isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'}`
          }
        >
          <span className="text-xl mb-0.5">{item.icon}</span>
          {item.name}
        </NavLink>
      ))}
    </div>
  );
}

export default BottomNav;