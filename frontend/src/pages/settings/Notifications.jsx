// src/pages/settings/Notifications.jsx
import React, { useState } from 'react';
// Button dan Link DIHAPUS dari import karena tidak lagi digunakan di header
// import Button from '../../components/common/Button.jsx'; 


// Data preferensi notifikasi (State Awal)
const initialPreferences = {
    emailNotifications: true,
    pushNotifications: false,
    maintenanceAlerts: true,
    criticalAlertsOnly: false,
    weeklyReports: true,
};

// DATA IKON DAN WARNA BARU (Sama seperti sebelumnya)
const NotificationData = {
    email: { icon: '✉️', color: 'text-blue-500', bgColor: 'bg-blue-50' },
    push: { icon: '🔔', color: 'text-green-500', bgColor: 'bg-green-50' },
    maintenance: { icon: '🛠️', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }, 
    critical: { icon: '🔴', color: 'text-red-600', bgColor: 'bg-red-50' },
    reports: { icon: '📊', color: 'text-purple-600', bgColor: 'bg-purple-50' }, 
};


// Komponen Reusable untuk Toggle Switch
const ToggleItem = ({ label, description, id, checked, onChange, iconType }) => {
    const iconData = NotificationData[iconType];
    
    return (
        <div className="flex items-start justify-between py-4 border-b last:border-b-0">
            {/* Kiri: Ikon, Judul, Deskripsi */}
            <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full text-xl ${iconData.bgColor} ${iconData.color}`}>
                    {iconData.icon} 
                </div>
                
                <div>
                    <label htmlFor={id} className="text-lg font-medium text-gray-900 cursor-pointer">
                        {label}
                    </label>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>

            {/* Kanan: Toggle Switch */}
            <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        id={id}
                        type="checkbox"
                        checked={checked}
                        onChange={onChange}
                        className="sr-only peer"
                    />
                    {/* Visual switch body */}
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
        </div>
    );
};


function NotificationsPage() {
    const [preferences, setPreferences] = useState(initialPreferences);

    const handleChange = (e) => {
        // 1. Perbarui state
        setPreferences(prev => {
            const newState = {
                ...prev,
                [e.target.id]: e.target.checked,
            };
            
            // 2. SIMULASI AUTO-SAVE (LOGIKA UTAMA)
            console.log('Auto-saving preferences:', newState);
            // alert('Preferences updated automatically! (Simulasi API call)'); 
            
            return newState;
        });
        
        // Catatan: Karena state update bersifat asynchronous, logic alert() lebih baik di taruh di dalam setPreferences
    };
    
    // (handleSave function DIHAPUS)

    return (
        <div className="space-y-10">
            
            {/* HEADER (TIDAK ADA LAGI TOMBOL SAVE DI KANAN) */}
            <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
            </div>
            
            {/* GRUP PENGATURAN */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Choose how you want to be notified about system updates and alerts</h3>
                
                <div className="space-y-2">
                    {/* Email Notifications */}
                    <ToggleItem
                        id="emailNotifications"
                        label="Email Notifications"
                        description="Receive email updates about critical system alerts"
                        checked={preferences.emailNotifications}
                        onChange={handleChange}
                        iconType="email"
                    />
                    
                    {/* Push Notifications */}
                    <ToggleItem
                        id="pushNotifications"
                        label="Push Notifications"
                        description="Get instant notifications on your device"
                        checked={preferences.pushNotifications}
                        onChange={handleChange}
                        iconType="push"
                    />
                    
                    {/* Maintenance Alerts */}
                    <ToggleItem
                        id="maintenanceAlerts"
                        label="Maintenance Alerts"
                        description="Scheduled maintenance reminders and updates"
                        checked={preferences.maintenanceAlerts}
                        onChange={handleChange}
                        iconType="maintenance"
                    />
                    
                    {/* Critical Alerts Only */}
                    <ToggleItem
                        id="criticalAlertsOnly"
                        label="Critical Alerts Only"
                        description="Receive notifications only for issues marked as 'Critical'"
                        checked={preferences.criticalAlertsOnly}
                        onChange={handleChange}
                        iconType="critical"
                    />
                    
                    {/* Weekly Reports */}
                    <ToggleItem
                        id="weeklyReports"
                        label="Weekly Reports"
                        description="Get weekly summary of system performance"
                        checked={preferences.weeklyReports}
                        onChange={handleChange}
                        iconType="reports"
                    />
                </div>
            </div>

        </div>
    );
}

export default NotificationsPage;