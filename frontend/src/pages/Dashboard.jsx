import React from 'react';
import StatCard from '../components/common/StatCard.jsx';
import AlertItem from '../components/common/AlertItem.jsx'; 
import { Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Cpu, Bell, Thermometer, Activity } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// 3. Mock Data untuk Grafik
const temperatureData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [
    {
      label: 'Temperature (°F)',
      data: [68, 70, 72, 75, 74, 71, 69], 
      borderColor: '#1a73e8', 
      backgroundColor: 'rgba(26, 115, 232, 0.1)',
      tension: 0.4,
      pointRadius: 5,
    },
  ],
};

// 3. Mock Data untuk Grafik Vibrasi 
const vibrationData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [
    {
      label: 'Vibration (mm/s)',
      data: [0.7, 0.8, 0.9, 0.85, 0.75, 0.8, 0.7], 
      borderColor: '#ff9800', 
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
      tension: 0.4,
      pointRadius: 5,
    },
  ],
};

// 4. Mock Data untuk Kartu Statistik 
const dashboardStats = [
  { 
    id: 1, 
    title: 'Equipment Status', 
    value: '94%', 
    unit: '', 
    description: 'Operational', 
    icon: Cpu, 
    color: 'text-status-success', 
    bgColor: 'bg-green-50' 
  },
  { 
    id: 2, 
    title: 'Active Alerts', 
    value: 3, 
    unit: '', 
    description: 'Critical issues', 
    icon: Bell, 
    color: 'text-status-critical', 
    bgColor: 'bg-red-50' 
  },
  { 
    id: 3, 
    title: 'Avg Temperature', 
    value: 72, 
    unit: '°F', 
    description: 'Normal range', 
    icon: Thermometer, 
    color: 'text-primary', 
    bgColor: 'bg-blue-50' 
  },
  { 
    id: 4, 
    title: 'Avg Vibration', 
    value: 0.8, 
    unit: 'mm/s', 
    description: 'Normal range', 
    icon: Activity, 
    color: 'text-status-success', 
    bgColor: 'bg-yellow-50' 
  },
];

// 5. Data Alerts
const recentAlerts = [
    { id: 1, title: 'Motor Bearing Temperature High', equipment: 'Pump #A-001', time: '5 min ago', type: 'Critical' },
    { id: 2, title: 'Vibration Threshold Exceeded', equipment: 'Compressor #B-003', time: '2 hours ago', type: 'Critical' },
    { id: 3, title: 'Maintenance Due Soon', equipment: 'Generator #C-002', time: '1 hour ago', type: 'Warning' },
    { id: 4, title: 'Pressure Reading Normal', equipment: 'Boiler #D-004', time: '18 mins ago', type: 'Normal' },
    { id: 5, title: 'Scheduled Inspection', equipment: 'Turbine #E-005', time: '3 hours ago', type: 'Warning' },
];

function DashboardPage() {
  return (
    <div className="space-y-8">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Predictive Maintenance Dashboard
      </h1>
      
      {/* ROW 1: STAT CARD (4 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* ROW 2: GRAFIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Grafik 1: Temperature Trends */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Temperature Trends</h3>
          <p className="text-sm text-gray-500 mb-4">Last 24 hours</p>
          <div className="h-64">
             <Line data={temperatureData} options={{ responsive: true, maintainAspectRatio: false }} /> 
          </div>
        </div>
        
        {/* Placeholder Grafik 2: Vibration Trends */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Vibration Trends</h3>
          <p className="text-sm text-gray-500 mb-4">Last 24 hours</p>
          <div className="h-64">
             <Line data={vibrationData} options={{ responsive: true, maintainAspectRatio: false }} /> 
          </div>
        </div>

      </div> 

      {/* ROW 3: RECENT ALERTS */}
      <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Alerts</h3>
          <span className="text-sm text-gray-500">
              {recentAlerts.filter(a => a.type === 'Critical').length} Critical
          </span>
        </div>

        <div className="space-y-4">
          {recentAlerts.map((alert) => (
            <AlertItem 
              key={alert.id}
              title={alert.title}
              equipment={alert.equipment}
              time={alert.time}
              type={alert.type}
            />
          ))}
        </div>

        <button className="w-full mt-6 text-primary hover:text-primary-hover font-medium">
          View All Alerts
        </button>
      </div>

    </div>
  );
}

export default DashboardPage;