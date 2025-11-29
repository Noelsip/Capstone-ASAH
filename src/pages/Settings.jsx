import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const settingsNav = [
  { name: 'Profile', path: '/settings' },
  { name: 'Notifications', path: '/settings/notifications' },
  { name: 'Preferences', path: '/settings/preferences' }, 
  { name: 'Security', path: '/settings/security' },
  { name: 'System', path: '/settings/system' },
];

function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Settings
      </h1>
      <p className="text-gray-500">Manage your account preferences and system configuration</p>
      
      <div className="flex bg-white rounded-xl shadow-lg border border-gray-100 min-h-[600px] overflow-hidden">
        
        {/* Sidebar Internal Settings */}
        <div className="w-64 p-2 border-r border-gray-200">
          <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2 p-2">Settings</h3> {}
          <nav className="space-y-1">
            {settingsNav.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/settings'} 
                    className={({ isActive }) => 
                        `flex items-center px-4 py-3 rounded-lg transition-colors text-base font-medium 
                        ${isActive 
                            ? 'bg-primary/10 text-primary font-semibold' 
                            : 'text-gray-700 hover:bg-gray-50'}`
                    }
                >
                    {/* Placeholder Icon */}
                    <span className="mr-3">{item.name[0]}</span> 
                    {item.name}
                </NavLink>
            ))}
          </nav>
        </div>
        
        {/* Konten Halaman */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet /> {/* Ini akan menampilkan konten di Pengaturan kek Profile, Notifications, etc. */}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;