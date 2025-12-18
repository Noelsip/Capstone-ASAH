import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const BASE_URL = 'http://localhost:3000';

function Header({ alerts = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); 
  const [isNotifOpen, setIsNotifOpen] = useState(false); 
  const [user, setUser] = useState({
    name: '', 
    title: '',
    initials: '' 
  });
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      const userData = data.user;

      const nameParts = userData.name.split(' ');
      const initials = nameParts.length >= 2 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : userData.name.substring(0, 2).toUpperCase();

      setUser({
        name: userData.name,
        title: userData.role?.role_desc || userData.role?.role_name || 'User',
        initials: initials
      });

    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser({ name: 'User', title: 'Guest', initials: 'U' });
    }
  };

  const handleNotificationClick = () => {
      setIsNotifOpen(!isNotifOpen);
      setIsMenuOpen(false); 
  };
  
  const handleProfileSettingsClick = () => {
      setIsMenuOpen(false); 
      navigate('/settings');
  }

  const handleLogout = () => {
      setIsMenuOpen(false); 
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      navigate('/login');
  };

  return (
    <header className="h-20 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 md:px-8 relative">
      <div className="flex items-center space-x-4">
        <button className="md:hidden p-2 text-gray-500 hover:text-primary transition-colors" onClick={() => setIsSidebarVisible(!isSidebarVisible)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900 hidden md:block tracking-tight">Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <button className="text-gray-500 hover:text-primary transition-all relative p-2 rounded-full hover:bg-gray-50" onClick={handleNotificationClick}>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.36 6 8.304 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {alerts.length > 0 && (
              <span className="absolute top-1 right-1 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 text-[10px] text-white text-center font-bold leading-4">
                {alerts.length}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Latest 5</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="p-8 text-center text-gray-400 text-xs italic">No new notifications</p>
                ) : (
                  // FITUR: Hanya tampilkan 5 data terbaru di dropdown
                  alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="p-4 border-b border-gray-50 hover:bg-blue-50 cursor-pointer transition-colors" onClick={() => { setIsNotifOpen(false); navigate(`/equipment/${alert.machine_serial || alert.sensor_reading?.machine_serial || ''}`); }}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800 line-clamp-2">{alert.alert_desc || alert.description}</p>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase font-medium">{alert.machine_serial} • New</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button onClick={() => { setIsNotifOpen(false); navigate('/alerts'); }} className="w-full py-3 text-sm text-primary font-bold hover:bg-gray-50 border-t border-gray-100 transition-colors">
                View All Notifications History
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => { setIsMenuOpen(!isMenuOpen); setIsNotifOpen(false); }}>
            <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">{user.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">{user.title}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-transparent group-hover:ring-primary/20 transition-all">{user.initials}</div>
        </div>
        
        {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-100 animate-in fade-in zoom-in duration-150">
                <button onClick={handleProfileSettingsClick} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Profile Settings</button>
                <div className="border-t border-gray-100 my-1"></div>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Log Out</button>
            </div>
        )}
      </div>
    </header>
  );
}

export default Header;