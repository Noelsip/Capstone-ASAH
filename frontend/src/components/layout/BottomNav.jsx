import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Wrench, AlertTriangle, Bot } from 'lucide-react';

// Data Navigasi Utama (diambil dari Sidebar)
const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Equipment', path: '/equipment', icon: Wrench },
    { name: 'Alerts', path: '/alerts', icon: AlertTriangle },
    { name: 'AI Chat', path: '/ai-assistant', icon: Bot },
];

function BottomNav() {
  return (
    // Fixed bottom bar - visible only on screens smaller than md
    <div className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 shadow-2xl 
                    flex justify-around items-center z-40 md:hidden">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        
        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center h-full text-xs font-medium transition-colors 
              ${isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'}`
            }
          >
            <IconComponent size={24} strokeWidth={2} className="mb-1" />
            {item.name}
          </NavLink>
        );
      })}
    </div>
  );
}

export default BottomNav;