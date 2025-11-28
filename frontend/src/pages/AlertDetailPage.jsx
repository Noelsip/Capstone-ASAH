import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// MOCK DATA Sederhana untuk Detail 
const MOCK_ALERT_DETAILS = {
    1: {
        title: "Motor Bearing Temperature High",
        severity: "Critical",
        id: "ALT-000001",
        equipment: "Pump #A-001",
        status: "Active",
        description: "Temperature exceeds safe operating threshold of 85°C.",
        actions: ["Inspect cooling system (Est. 30 mins, Immediate)", "Check coolant levels (Est. 15 mins, Immediate)"],
        timeline: ["Alert created 2 mins ago", "Threshold exceeded 5 mins ago", "Warning detected 10 mins ago"],
    },
};

function AlertDetailPage() {
    const { alertId } = useParams();
    const navigate = useNavigate();
    const alert = MOCK_ALERT_DETAILS[alertId];

    if (!alert) {
        return <div className="p-8 text-center text-red-500 text-xl font-semibold">Alert ID "{alertId}" not found.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header Detail */}
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Alert Detail: {alert.title}</h1>
                <button 
                    onClick={() => navigate('/alerts')} 
                    className="text-primary hover:text-primary-hover text-sm"
                >
                    &lt; Back to Alerts List
                </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded-xl shadow-lg border">
                {/* Kolom Kiri - Status & Deskripsi */}
                <div className="col-span-2 space-y-6">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
                        {alert.severity}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-700">Description</h3>
                    <p className="text-gray-600">{alert.description}</p>

                    <h3 className="text-xl font-semibold text-gray-700 mt-6">Recommended Actions</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        {alert.actions.map((action, index) => <li key={index}>{action}</li>)}
                    </ul>
                </div>
                
                {/* Kolom Kanan - Timeline */}
                <div className="col-span-1 border-l pl-6 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700">Timeline</h3>
                    {alert.timeline.map((event, index) => (
                        <div key={index} className="space-y-0.5">
                            <p className="font-medium text-sm text-gray-900">{event}</p>
                            <p className="text-xs text-gray-500">by System</p>
                        </div>
                    ))}
                    <div className="mt-4">
                        <span className="text-lg font-semibold text-primary">Status: {alert.status}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AlertDetailPage;