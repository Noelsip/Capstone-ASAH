import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css';

//  Impor Halaman Konten Utama 
import App from './App.jsx';
import NotFoundPage from './pages/NotFound.jsx';

//  Impor Halaman Auth
import LoginPage from './pages/Login.jsx'; 
import RegisterPage from './pages/Register.jsx'; 

// --- Impor Halaman Aplikasi Utama 
import DashboardPage from './pages/Dashboard.jsx';
import EquipmentPage from './pages/Equipment.jsx';
import EquipmentDetailPage from './pages/EquipmentDetail.jsx'; 
import AlertsPage from './pages/Alerts.jsx';
import AlertDetailPage from './pages/AlertDetailPage.jsx';
import AIAssistantPage from './pages/AIAssistant.jsx';

// --- Impor Halaman Settings 
import SettingsPage from './pages/Settings.jsx';
import ProfilePage from './pages/settings/Profile.jsx';
import NotificationsPage from './pages/settings/Notifications.jsx';
import PreferencesPage from './pages/settings/Preferences.jsx';
import SecurityPage from './pages/settings/Security.jsx';
import SystemPage from './pages/settings/System.jsx';



// --- DEFINISI ROUTER UTAMA ---
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true, 
        element: <DashboardPage />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/equipment', 
        element: <EquipmentPage />,
      },
      {
        path: '/equipment/:equipmentId', 
        element: <EquipmentDetailPage />,
      },
      {
        path: '/alerts',
        element: <AlertsPage />,
      },
      {
        path: '/alerts/:alertId', 
        element: <AlertDetailPage />,
      },
      {
        path: '/ai-assistant',
        element: <AIAssistantPage />,
      },
      
      {
        path: '/settings',
        element: <SettingsPage />,
        children: [
          {
            index: true, 
            element: <ProfilePage />,
          },
          {
            path: 'notifications',
            element: <NotificationsPage />,
          },
          {
            path: 'preferences',
            element: <PreferencesPage />,
          },
          {
            path: 'security',
            element: <SecurityPage />,
          },
          {
            path: 'system',
            element: <SystemPage />,
          },
        ]
      },
    ],
  },
  
  // Untuk Rute Auth (di luar layout utama App)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);