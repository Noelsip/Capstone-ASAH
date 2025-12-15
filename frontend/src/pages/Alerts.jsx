import React, { useEffect, useState } from 'react';
import FilterDropdown from '../components/common/FilterDropdown.jsx';
import { getPredictions, acknowledgeAlert } from '../api/predictions';
import { formatDistanceToNow } from 'date-fns';
import AlertDetailModal from '../components/common/AlertDetailModal.jsx';

const statusOptions = ['All Status', 'Active', 'Inactive', 'Acknowledged', 'Resolved'];
const severityOptions = ['All Severity', 'Critical', 'Warning', 'Normal'];

const statusMap = {
    open: 'Active',
    active: 'Active',
    inactive: 'Inactive',
    acknowledged: 'Acknowledged',
    resolved: 'Resolved',
    normal: 'Inactive'
};

function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
    const [selectedSeverity, setSelectedSeverity] = useState(severityOptions[0]);
    const [selectedAlertId, setSelectedAlertId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Stat card summary
    const [summary, setSummary] = useState({
        total: 0,
        critical: 0,
        warning: 0,
        resolved: 0,
    });

    // Ambil data user dari localStorage
    const getCurrentUser = () => {
        try {
            const user = JSON.parse(localStorage.getItem('authUser'));
            return user && user.id ? user : null;
        } catch {
            return null;
        }
    };

    // Fetch data alert dari backend
    const fetchAlerts = () => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        getPredictions()
            .then(res => {
                let arr = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
                // Mapping status agar selalu sesuai opsi
                arr = arr.map(item => ({
                    ...item,
                    status: statusMap[item.status?.toLowerCase()] || item.status
                }));
                // Filter status setelah mapping
                if (selectedStatus !== 'All Status') {
                    arr = arr.filter(item => item.status === selectedStatus);
                }
                // Filter severity
                if (selectedSeverity !== 'All Severity') {
                    arr = arr.filter(item => {
                        return (item.severity || '').toLowerCase() === selectedSeverity.toLowerCase();
                    });
                }
                setAlerts(arr);

                // Hitung summary stat card
                setSummary({
                    total: arr.length,
                    critical: arr.filter(a => (a.severity || '').toLowerCase() === 'critical').length,
                    warning: arr.filter(a => (a.severity || '').toLowerCase() === 'warning').length,
                    resolved: arr.filter(a => a.status === 'Resolved').length,
                });
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAlerts();
        // eslint-disable-next-line
    }, [selectedStatus, selectedSeverity]);

    // Handler acknowledge
    const handleAcknowledge = async (item) => {
        setErrorMessage('');
        setSuccessMessage('');
        const user = getCurrentUser();
        if (!user) {
            setErrorMessage('User ID tidak ditemukan! Silakan login ulang.');
            return;
        }
        const alertId = item.alert_id || (item.alert && item.alert.id) || item.id;
        if (!alertId) {
            setErrorMessage('Alert ID tidak ditemukan!');
            return;
        }
        try {
            await acknowledgeAlert(alertId);
            setSuccessMessage('Acknowledge berhasil!');
            fetchAlerts();
        } catch (err) {
            let msg = 'Gagal acknowledge alert!';
            if (err?.response?.data?.message) {
                msg = err.response.data.message;
            }
            if (msg.toLowerCase().includes('already acknowledged')) {
                msg = 'Alert sudah di-acknowledge oleh user lain.';
            }
            setErrorMessage(msg);
            fetchAlerts();
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Alert Management</h1>
            <p className="text-gray-500 mb-4">Monitor and manage all equipment alerts across your facility</p>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Total Active Alerts */}
                <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-500 rounded-full p-2">
                            <svg width="24" height="24" fill="none"><rect width="18" height="18" x="3" y="3" rx="5" fill="currentColor" /></svg>
                        </span>
                        <span className="text-gray-700 font-semibold">Total Active Alerts</span>
                    </div>
                    <div className="text-3xl font-bold mt-2">{summary.total}</div>
                    {/* <div className="text-xs text-gray-400 mt-1">+12% vs last week</div> */}
                </div>
                {/* Critical Alerts */}
                <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="bg-red-100 text-red-500 rounded-full p-2">
                            <svg width="24" height="24" fill="none"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
                        </span>
                        <span className="text-red-500 font-semibold">Critical Alerts</span>
                    </div>
                    <div className="text-3xl font-bold text-red-500 mt-2">{summary.critical}</div>
                    <div className="text-xs text-gray-400 mt-1">Requires action</div>
                </div>
                {/* Warning Alerts */}
                <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="bg-yellow-100 text-yellow-500 rounded-full p-2">
                            <svg width="24" height="24" fill="none"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
                        </span>
                        <span className="text-yellow-500 font-semibold">Warning Alerts</span>
                    </div>
                    <div className="text-3xl font-bold text-yellow-500 mt-2">{summary.warning}</div>
                    <div className="text-xs text-gray-400 mt-1">Monitor closely</div>
                </div>
                {/* Resolved Alerts */}
                <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="bg-green-100 text-green-500 rounded-full p-2">
                            <svg width="24" height="24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span className="text-green-500 font-semibold">Resolved Alerts</span>
                    </div>
                    <div className="text-3xl font-bold text-green-500 mt-2">{summary.resolved}</div>
                    <div className="text-xs text-gray-400 mt-1">Today</div>
                </div>
            </div>
            {/* Filter */}
            <div className="flex flex-wrap gap-4 items-center mb-4">
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
                <button className="ml-auto px-4 py-2 bg-gray-100 rounded text-sm font-medium border hover:bg-gray-200">
                    Export Report
                </button>
            </div>
            {/* Table */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Alert Details</h3>
                {errorMessage && (
                    <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded border border-red-200">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 px-4 py-2 bg-green-100 text-green-700 rounded border border-green-200">
                        {successMessage}
                    </div>
                )}
                {loading ? (
                    <div>Loading...</div>
                ) : alerts.length === 0 ? (
                    <div>No alerts found.</div>
                ) : (
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-600 border-b">
                                <th className="py-3 px-3">Priority</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-3">Alert Details</th>
                                <th className="py-3 px-3">Equipment</th>
                                <th className="py-3 px-3">Location</th>
                                <th className="py-3 px-3">Time</th>
                                <th className="py-3 px-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.map(item => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 align-top">
                                    {/* PRIORITY */}
                                    <td className="py-4 px-3">
                                        <span className={`flex items-center gap-2`}>
                                            <span className={`w-2 h-2 rounded-full ${
                                                item.priority === 'P1' ? 'bg-red-500' :
                                                item.priority === 'P2' ? 'bg-yellow-400' :
                                                'bg-gray-400'
                                            }`}></span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                item.priority === 'P1' ? 'bg-red-100 text-red-600' :
                                                item.priority === 'P2' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {item.priority || 'P1'}
                                            </span>
                                        </span>
                                    </td>
                                    {/* STATUS */}
                                    <td className="py-4 px-3">
                                        <span className="flex items-center gap-2">
                                            {item.status === 'Active' && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                                            )}
                                            {item.status === 'Acknowledged' && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                                            )}
                                            {item.status === 'Resolved' && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                                            )}
                                            {item.status === 'Inactive' && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                                            )}
                                            <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                                                item.status === 'Active'
                                                    ? 'bg-red-100 text-red-600 border border-red-200'
                                                    : item.status === 'Acknowledged'
                                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                    : item.status === 'Resolved'
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}>
                                                {item.status}
                                                {item.status === 'Acknowledged' && item.acknowledged_by && (
                                                    <span className="ml-2 text-xs text-purple-700 font-normal">
                                                        by {item.acknowledged_by}
                                                    </span>
                                                )}
                                            </span>
                                        </span>
                                    </td>
                                    {/* ALERT DETAILS */}
                                    <td className="py-4 px-3">
                                        <div className="font-bold text-gray-800">
                                            {
                                                item.title
                                                ? item.title
                                                : item.description
                                                ? item.description
                                                : item.detail
                                                ? item.detail
                                                : "Tidak ada Alert detail"
                                            }
                                        </div>
                                        <div className="text-xs text-gray-500">{item.description}</div>
                                    </td>
                                    {/* EQUIPMENT */}
                                    <td className="py-4 px-3">
                                        <span className="flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-600 rounded-full p-1">
                                                <svg width="16" height="16" fill="currentColor" className="inline"><circle cx="8" cy="8" r="7"/></svg>
                                            </span>
                                            <span className="font-semibold text-blue-700">
                                                {item.machine_name ||
                                                item.sensor_reading?.machine?.name ||
                                                item.sensor_reading?.machine_serial ||
                                                '-'}
                                            </span>
                                        </span>
                                    </td>
                                    {/* LOCATION */}
                                    <td className="py-4 px-3">{item.location || '-'}</td>
                                    {/* TIME */}
                                    <td className="py-4 px-3 text-gray-500">
                                        {(() => {
                                            const date = new Date(item.created_at);
                                            return item.created_at && !isNaN(date)
                                                ? formatDistanceToNow(date, { addSuffix: true })
                                                : '-';
                                        })()}
                                    </td>
                                    {/* ACTIONS */}
                                    <td className="py-4 px-3">
                                        {/* Tombol acknowledge hanya tampil jika belum acknowledged */}
                                        {(!item.acknowledged_by) && (
                                            <button
                                                className="px-3 py-1 rounded mr-2 text-xs font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                onClick={() => handleAcknowledge(item)}
                                            >
                                                Acknowledge
                                            </button>
                                        )}
                                        {/* Jika sudah acknowledged, tampilkan nama user */}
                                        {item.acknowledged_by && (
                                            <span className="px-3 py-1 rounded mr-2 text-xs font-semibold bg-green-100 text-green-700">
                                                Acknowledged by {item.acknowledged_by}
                                            </span>
                                        )}
                                        <button
                                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-200 transition"
                                            onClick={() => setSelectedAlertId(item.alert_id || (item.alert && item.alert.id) || item.id)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {selectedAlertId ? (
                    <AlertDetailModal
                        alertId={selectedAlertId}
                        onClose={() => setSelectedAlertId(null)}
                    />
                ) : null}
            </div>
        </div>
    );
}

export default AlertsPage;