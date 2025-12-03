import React from 'react';
import StatCard from '../components/common/StatCard.jsx';
import AlertItem from '../components/common/AlertItem.jsx'; 
import { Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const Icons = {
  Equipment: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM15 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-7.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12 17.25a6.75 6.75 0 01-6.75-6.75h13.5a6.75 6.75 0 01-6.75 6.75z" /></svg>`,
  Alerts: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.332 7.026 7.026 0 01-4.354 1.488c-1.616 0-3.18-0.384-4.52-1.077m0 0l-1.01-1.286-1.579-2.008H5.733A8.995 8.995 0 013 14.25c0-2.67.65-5.328 1.83-7.585 1.18-2.257 3.018-4.148 5.275-5.328 2.257-1.18 4.757-1.785 7.257-1.785a9.004 9.004 0 016.364 2.636 9.004 9.004 0 012.636 6.364c0 2.499-0.58 4.999-1.76 7.257-1.18 2.257-3.018 4.148-5.275 5.328-2.257 1.18-4.757 1.785-7.257 1.785A23.87 23.87 0 004.5 18.75m0-11.25a4.5 4.5 0 109 0 4.5 4.5 0 00-9 0z" /></svg>`,
  Temperature: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m0-18A6 6 0 006 9c0 4.5 6 9 6 9v-9z" /></svg>`,
  Vibration: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.025 15a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm0 0v-4.5m-3 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 0v-4.5m3-3a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm0 0V8.25m-3 3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 0V8.25m3-3a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm0 0V2.25m-3 3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 0V2.25m3 3a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zm0 0V8.25" /></svg>`,
};

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
  { id: 1, title: 'Equipment Status', value: '94%', unit: '', description: 'Operational', icon: Icons.Equipment, color: 'text-status-success', bgColor: 'bg-green-50' },
  { id: 2, title: 'Active Alerts', value: 3, unit: '', description: 'Critical issues', icon: Icons.Alerts, color: 'text-status-critical', bgColor: 'bg-red-50' },
  { id: 3, title: 'Avg Temperature', value: 72, unit: '°F', description: 'Normal range', icon: Icons.Temperature, color: 'text-primary', bgColor: 'bg-blue-50' },
  { id: 4, title: 'Avg Vibration', value: 0.8, unit: 'mm/s', description: 'Normal range', icon: Icons.Vibration, color: 'text-status-success', bgColor: 'bg-yellow-50' },
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