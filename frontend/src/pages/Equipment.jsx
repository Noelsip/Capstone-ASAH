import React from 'react';
import { Link } from 'react-router-dom'; 
import StatCard from '../components/common/StatCard.jsx'; 
import ProgressBar from '../components/common/ProgressBar.jsx'; 

// Mock Data untuk KPI Summary
const equipmentKpis = [
  { id: 1, title: 'Total Equipment', value: 9, unit: '', icon: '⚙️', color: 'text-gray-600', description: 'Total mesin yang terdaftar' },
  { id: 2, title: 'Operating', value: 4, unit: '', icon: '✅', color: 'text-status-success', description: 'Berjalan Normal' },
  { id: 3, title: 'Warning', value: 2, unit: '', icon: '⚠️', color: 'text-status-warning', description: 'Perlu Perhatian' },
  { id: 4, title: 'Critical', value: 1, unit: '', icon: '❌', color: 'text-status-critical', description: 'Perlu Perbaikan Segera' },
  { id: 5, title: 'Avg. Health', value: '69%', unit: '', icon: '🧡', color: 'text-primary', description: 'Rata-rata Kesehatan' },
];

// Mock Data untuk Daftar Peralatan 
const equipmentList = [
  { id: 'A-001', name: 'Pump #A-001', type: 'Hydraulic Pump', status: 'Operating', health: '92%', location: 'Production Line', maintenance: '28 days' },
  { id: 'B-003', name: 'Compressor #B-003', type: 'Air Compressor', status: 'Warning', health: '68%', location: 'HVAC System', maintenance: '15 days' },
  { id: 'C-002', name: 'Generator #C-002', type: 'Power Generator', status: 'Operating', health: '88%', location: 'Power Plant', maintenance: '25 days' },
  { id: 'F-006', name: 'Hydraulic Pump #F-006', type: 'Hydraulic Pump', status: 'Critical', health: '45%', location: 'Assembly Line', maintenance: 'Overdue' },
];

function EquipmentPage() {
  return (
    <div className="space-y-8">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Equipment Management
      </h1>
      <p className="text-gray-500 mb-6">Monitor and manage all equipment across your facility</p>

      {/* ROW 1: KPI Summary (5 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {equipmentKpis.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* ROW 2: Tombol Aksi dan Filter */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex space-x-4">
            {/* Placeholder Filter */}
            <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 border border-gray-300">
                Filter: All Status
            </button>
            <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 border border-gray-300">
                Filter: All Location
            </button>
        </div>
        {/* Tombol Export */}
        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
            Export Report
        </button>
      </div>

      {/* ROW 3: Daftar Peralatan (Tabel/List View) */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Equipment List</h3>
        
        {/* Kerangka Tabel (Header) */}
        <div className="grid grid-cols-6 gap-4 border-b pb-2 text-sm font-semibold text-gray-600 uppercase">
            <div>Equipment</div>
            <div>Status</div>
            <div>Health</div>
            <div>Location</div>
            <div>Next Maintenance</div>
            <div className="text-right">Actions</div>
        </div>

        {}
        {equipmentList.map((item) => (
            <div key={item.id} className="grid grid-cols-6 gap-4 py-3 border-b hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className={`font-semibold ${item.status === 'Critical' ? 'text-status-critical' : 'text-status-success'}`}>{item.status}</div>
                
                {/* INTEGRASI PROGRESS BAR */}
                <div className="flex flex-col space-y-1 justify-center">
                    <span className="font-semibold text-sm">{item.health}</span>
                    <ProgressBar percentage={item.health} />
                </div>
                
                <div>{item.location}</div>
                <div>{item.maintenance}</div>
                
                {}
                <div className="text-right">
                    <Link 
                        to={`/equipment/${item.id}`} 
                        className="text-primary text-sm hover:underline"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        ))}
      </div>

    </div>
  );
}

export default EquipmentPage;