import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/common/StatCard.jsx';
import Button from '../components/common/Button.jsx';
import FilterDropdown from '../components/common/FilterDropdown.jsx'; 
import SuccessModal from '../components/common/SuccessModal.jsx';     


// 1. Mock Data untuk KPI Summary
const alertKpis = [
  { id: 1, title: 'Total Active Alerts', value: 7, icon: '🚨', color: 'text-primary' },
  { id: 2, title: 'Critical Alerts', value: 2, icon: '❌', color: 'text-status-critical' },
  { id: 3, title: 'Warning Alerts', value: 4, icon: '⚠️', color: 'text-status-warning' },
  { id: 4, title: 'Resolved Alerts', value: 2, icon: '✅', color: 'text-status-success' },
];

// 2. Mock Data untuk Tabel Peringatan
const alertTableData = [
  { id: 1, priority: 'P1', status: 'Active', detail: 'Motor Bearing Temperature High', equipment: 'Pump #A-001', location: 'Production Line', time: '2 mins ago', severity: 'Critical' },
  { id: 2, priority: 'P2', status: 'Active', detail: 'Vibration Threshold Exceeded', equipment: 'Compressor #B-003', location: 'HVAC System', time: '5 mins ago', severity: 'Critical' },
  { id: 3, priority: 'P3', status: 'Active', detail: 'Maintenance Due Soon', equipment: 'Generator #C-002', location: 'Power Plant', time: '1 hour ago', severity: 'Warning' },
  { id: 4, priority: 'P4', status: 'Active', detail: 'System Check Recommended', equipment: 'Boiler #D-004', location: 'Heating System', time: '45 mins ago', severity: 'Warning' },
  { id: 5, priority: 'P5', status: 'Inactive', detail: 'Oil Leak Detected (Resolved)', equipment: 'Turbine #E-005', location: 'Energy Sector', time: '1 day ago', severity: 'Warning' },
  { id: 6, priority: 'P6', status: 'Inactive', detail: 'Filter Clogged (Resolved)', equipment: 'Fan #G-006', location: 'Ventilation', time: '3 days ago', severity: 'Critical' },
];

// Komponen Reusable untuk Badge Status
const StatusBadge = ({ status }) => {
    let colorClass;
    if (status === 'Critical') colorClass = 'bg-red-100 text-status-critical';
    else if (status === 'Warning') colorClass = 'bg-yellow-100 text-status-warning';
    else if (status === 'Active') colorClass = 'bg-green-600 text-white'; 
    else if (status === 'Inactive') colorClass = 'bg-red-200 text-red-700';
    else colorClass = 'bg-gray-100 text-gray-600';
    
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {status}
        </span>
    );
};

// Opsi Filter
const statusOptions = ['All Status', 'Active', 'Inactive', 'Acknowledged', 'Resolved'];
const severityOptions = ['All Severity', 'Critical', 'Warning', 'Normal'];


function AlertsPage() {
    const [isAcknowledgeModalOpen, setIsAcknowledgeModalOpen] = useState(false);
    const [isExportSuccessModalOpen, setIsExportSuccessModalOpen] = useState(false); 
    const [selectedAlertId, setSelectedAlertId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
    const [selectedSeverity, setSelectedSeverity] = useState(severityOptions[0]);

    // Logika Acknowledge
    const handleAcknowledgeClick = (id) => {
        setSelectedAlertId(id);
        setIsAcknowledgeModalOpen(true);
    };

    const handleConfirmAcknowledge = () => {
        alert(`Alert ${selectedAlertId} acknowledged successfully! (Simulasi)`);
        setIsAcknowledgeModalOpen(false);
    };
    
    // Logika Export Report
    const handleExportReport = () => {
        console.log('Exporting report...');
        setIsExportSuccessModalOpen(true);
    };


    return (
        <div className="space-y-8">
            
            {/* JUDUL */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Alert Management
            </h1>
            <p className="text-gray-500 mb-6">Monitor and manage all equipment alerts across your facility</p>

            {/* ROW 1: KPI Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {alertKpis.map((stat) => (
                    <StatCard 
                        key={stat.id} 
                        title={stat.title} 
                        value={stat.value} 
                        icon={stat.icon} 
                        color={stat.color} 
                        description={''} 
                    />
                ))}
            </div>

            {/* ROW 2: Tombol Aksi dan Filter */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex space-x-4">
                    {/* Filter Status */}
                    <FilterDropdown
                        title="All Status"
                        options={statusOptions}
                        selected={selectedStatus}
                        onSelect={setSelectedStatus}
                    />
                    {/* Filter Severity */}
                    <FilterDropdown
                        title="All Severity"
                        options={severityOptions}
                        selected={selectedSeverity}
                        onSelect={setSelectedSeverity}
                    />
                </div>
                
                  {/* Tombol Export */}
                <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors" onClick={handleExportReport}>
                 Export Report
                </button>
                </div>

            {/* ROW 3: Tabel Peringatan */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Alert Details</h3>
                
                {/* Kerangka Tabel (Header) */}
                <div className="grid grid-cols-7 gap-4 border-b pb-2 text-sm font-semibold text-gray-600 uppercase min-w-[1000px]">
                    <div>Priority</div>
                    <div>Status</div>
                    <div className="col-span-2">Alert Detail</div>
                    <div>Equipment</div>
                    <div>Time</div>
                    <div className="text-right">Actions</div>
                </div>

                {}
                {alertTableData.map((alert) => (
                    <div key={alert.id} className="grid grid-cols-7 gap-4 py-3 border-b hover:bg-gray-50 transition-colors min-w-[1000px]">
                        
                        <div className={`font-semibold ${alert.severity === 'Critical' ? 'text-status-critical' : 'text-status-warning'}`}>{alert.priority}</div>
                        
                        <div><StatusBadge status={alert.status} /></div>

                        <div className="col-span-2 text-gray-900">{alert.detail}</div>

                        <div className="text-gray-700">{alert.equipment}</div>

                        <div className="text-gray-500">{alert.time}</div>

                        {/* KOLOM ACTIONS DENGAN MODAL DAN LINK */}
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={() => handleAcknowledgeClick(alert.id)}
                                className="text-primary text-sm hover:underline"
                            >
                                Acknowledge
                            </button>
                            <Link
                                to={`/alerts/${alert.id}`}
                                className="text-primary text-sm hover:underline"
                            >
                                View
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {}
            {isAcknowledgeModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold text-gray-800">Confirm Acknowledge</h3>
                        <p className="text-gray-600">Are you sure you want to acknowledge Alert ID **#{selectedAlertId}**?</p>
                        <p className="text-sm text-red-500">Acknowledging an alert will confirm you are aware of the issue.</p>
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={() => setIsAcknowledgeModalOpen(false)}
                                className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <Button className="w-auto px-4 py-2" onClick={handleConfirmAcknowledge}>
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* POPUP SUKSES EXPORT REPORT */}
            <SuccessModal 
                isVisible={isExportSuccessModalOpen}
                onClose={() => setIsExportSuccessModalOpen(false)}
                message="Export Report has Successfully! Check your local download folder."
            />
        </div>
    );
}

export default AlertsPage;