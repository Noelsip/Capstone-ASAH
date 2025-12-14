import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard.jsx';
import { Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- MOCK DATA BUATAN SESUAI DATASET 
const MOCK_EQUIPMENT_DATA = {
    'B-003': { 
        id: 'B-003',
        name: 'Compressor #B-003', 
        type: 'Air Compressor', 
        location: 'HVAC System', 
        status: 'Warning',
        equipmentId: 'EQP-0002', 
        
        healthScore: '68%', 
        runtime: '4,120 hrs', 
        lastMaintenance: '15 days ago', 
        nextMaintenance: '15 days',
        
        // Data Metrik untuk Kartu
        metrics: {
            temperature: { value: '85', unit: '°C', description: 'Within normal range' },
            vibration: { value: 'High', unit: '', description: 'Vibration level' },
        },
        
        // Data untuk Grafik Suhu
        temperatureChartData: {
            labels: ['00:', '04:', '08:', '12:', '16:', '20:'],
            datasets: [{
                label: 'Temperature (°C)',
                data: [70, 72, 75, 80, 78, 85],
                borderColor: '#f59e0b', 
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                pointRadius: 3,
            }]
        },
        // Data untuk Grafik Performa (Placeholder)
        performanceChartData: {
            labels: ['00:', '04:', '08:', '12:', '16:', '20:'],
            datasets: [{
                label: 'Efficiency (%)',
                data: [90, 88, 85, 82, 83, 80],
                borderColor: '#1a73e8', 
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                tension: 0.4,
                pointRadius: 3,
            }]
        }
    },
    'A-001': { 
        id: 'A-001',
        name: 'Pump #A-001', 
        type: 'Hydraulic Pump', 
        location: 'Production Line', 
        status: 'Operating',
        equipmentId: 'EQP-0001',
        
        healthScore: '92%', 
        runtime: '2,340 hrs', 
        lastMaintenance: '2 days ago', 
        nextMaintenance: '28 days',
        
        metrics: {
            temperature: { value: '72', unit: '°C', description: 'Normal range' },
            vibration: { value: 'Normal', unit: '', description: 'Normal level' },
        },
        temperatureChartData: {
            labels: ['00:','04:','08:','12:','16:','20:'],
            datasets: [{
                label: 'Temperature (°C)',
                data: [68, 70, 72, 70, 71, 69],
                borderColor: '#10b981', 
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                pointRadius: 3,
            }]
        },
        performanceChartData: {
            labels: ['00:','04:','08:','12:','16:','20:'],
            datasets: [{
                label: 'Efficiency (%)',
                data: [95, 96, 94, 95, 93, 92],
                borderColor: '#1a73e8', 
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                tension: 0.4,
                pointRadius: 3,
            }]
        }
    },
};

const DetailIcons = {
    EquipmentBig: '⚙️',
    Close: '❌',
};

function EquipmentDetailPage() {
    const { equipmentId } = useParams();
    const navigate = useNavigate(); 
    const equipment = MOCK_EQUIPMENT_DATA[equipmentId];

    if (!equipment) {
        return <div className="p-8 text-center text-red-500 text-xl font-semibold">Equipment ID "{equipmentId}" not found.</div>;
    }

    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#6b7280' }
            },
            y: {
                grid: { color: '#e5e7eb' },
                ticks: { color: '#6b7280' }
            },
        },
    };

    return (
        <div className="min-h-screen bg-bg-main p-4 md:p-8">
            {/* CONTAINER UTAMA */}
            <div className="bg-white rounded-2xl shadow-xl max-w-5xl mx-auto p-6 md:p-8 space-y-6 border border-gray-100">
                
                {/* HEADER DETAIL */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 text-3xl bg-purple-100 rounded-full text-purple-700">
                            {DetailIcons.EquipmentBig}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{equipment.name}</h1>
                            <div className="flex items-center space-x-2 mt-1 text-sm">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                                                  ${equipment.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                    {equipment.status}
                                </span>
                                <span className="text-gray-600">{equipment.type}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-600">{equipment.location}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Equipment ID: {equipment.equipmentId}</p>
                        </div>
                    </div>
                    {/* Tombol Tutup/Kembali */}
                    <button 
                        onClick={() => navigate('/equipment')} 
                        className="p-2 text-2xl rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        {DetailIcons.Close}
                    </button>
                </div>

                {/* ROW 1: KEY METRICS (KARTU BARU) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title="Health Score" 
                        value={equipment.healthScore} 
                        description="Excellent condition" 
                        icon="🧡" 
                        color="text-green-600" 
                        iconBg="bg-green-50"
                        bgColor="bg-white"
                        className="shadow-sm"
                    />
                    <StatCard 
                        title="Temperature" 
                        value={equipment.metrics.temperature.value} 
                        unit={equipment.metrics.temperature.unit} 
                        description={equipment.metrics.temperature.description} 
                        icon="🌡️" 
                        color="text-red-600" 
                        iconBg="bg-red-50"
                        bgColor="bg-white"
                        className="shadow-sm"
                    />
                    <StatCard 
                        title="Vibration" 
                        value={equipment.metrics.vibration.value} 
                        unit={equipment.metrics.vibration.unit} 
                        description={equipment.metrics.vibration.description} 
                        icon="⚡" 
                        color="text-purple-600" 
                        iconBg="bg-purple-50"
                        bgColor="bg-white"
                        className="shadow-sm"
                    />
                    <StatCard 
                        title="Runtime" 
                        value={equipment.runtime} 
                        unit="hrs" 
                        description="Total operating hours" 
                        icon="🕒" 
                        color="text-blue-600" 
                        iconBg="bg-blue-50"
                        bgColor="bg-white"
                        className="shadow-sm"
                    />
                </div>

                {/* ROW 2: CHART TRENDS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Grafik 1: Temperature Trend */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Temperature Trend (24h)</h3>
                        <div className="h-64">
                            <Line data={equipment.temperatureChartData} options={chartOptions} />
                        </div>
                    </div>
                    {/* Grafik 2: Performance Efficiency */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Efficiency (24h)</h3>
                        <div className="h-64">
                            <Line data={equipment.performanceChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* ROW 3: MAINTENANCE HISTORY & NEXT SCHEDULE */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <StatCard 
                        title="Last Maintenance" 
                        value={equipment.lastMaintenance} 
                        description="Routine inspection completed" 
                        icon="🗓️" 
                        color="text-blue-600" 
                        iconBg="bg-blue-50"
                        bgColor="bg-white"
                        className="shadow-md"
                    />
                    <StatCard 
                        title="Next Maintenance" 
                        value={equipment.nextMaintenance} 
                        description="Scheduled maintenance" 
                        icon="🛠️" 
                        color="text-green-600" 
                        iconBg="bg-green-50"
                        bgColor="bg-white"
                        className="shadow-md"
                    />
                </div>

            </div>
        </div>
    );
}

export default EquipmentDetailPage;