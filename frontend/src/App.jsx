import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import BottomNav from './components/layout/BottomNav.jsx'; 
import Footer from './components/layout/Footer.jsx';

function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar untuk tampilan desktop */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header utama */}
        <Header />

        {/* Konten halaman dinamis */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8 pb-20 md:pb-8">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {}
      <BottomNav />
    </div>
  );
}

export default App;