import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/common/StatCard.jsx';
import FilterDropdown from '../components/common/FilterDropdown.jsx';
import { getPredictions } from '../api/predictions';

const statusOptions = ['All Status', 'Active', 'Inactive', 'Acknowledged', 'Resolved'];
const severityOptions = ['All Severity', 'Critical', 'Warning', 'Normal'];

function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
    const [selectedSeverity, setSelectedSeverity] = useState(severityOptions[0]);

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (selectedStatus !== 'All Status') params.status = selectedStatus.toLowerCase();
        if (selectedSeverity !== 'All Severity') params.severity = selectedSeverity.toLowerCase();

        getPredictions(params)
            .then(res => {
                const arr = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
                setAlerts(arr);
            })
            .finally(() => setLoading(false));
    }, [selectedStatus, selectedSeverity]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Alert Management</h1>
            <div className="flex space-x-4">
                <FilterDropdown
                    options={statusOptions}
                    selectedOption={selectedStatus}
                    onSelect={setSelectedStatus}
                />
                <FilterDropdown
                    options={severityOptions}
                    selectedOption={selectedSeverity}
                    onSelect={setSelectedSeverity}
                />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Alert Details</h3>
                {loading ? (
                    <div>Loading...</div>
                ) : alerts.length === 0 ? (
                    <div>No alerts found.</div>
                ) : (
                    alerts.map(alert => (
                        <Link key={alert.id} to={`/alerts/${alert.id}`}>
                            <AlertItem
                                title={alert.title || alert.detail}
                                equipment={alert.equipment || alert.machine_serial}
                                time={alert.time || alert.created_at}
                                type={alert.severity || alert.type}
                            />
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

export default AlertsPage;