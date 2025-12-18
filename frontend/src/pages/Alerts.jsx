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

    const [summary, setSummary] = useState({
        total: 0,
        critical: 0,
        warning: 0,
        resolved: 0,
    });

    const getCurrentUser = () => {
        try {
            const user = JSON.parse(localStorage.getItem('authUser'));
            return user && user.id ? user : null;
        } catch {
            return null;
        }
    };

    const fetchAlerts = () => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        getPredictions()
            .then(res => {
                let arr = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
                arr = arr.map(item => ({
                    ...item,
                    status: statusMap[item.status?.toLowerCase()] || item.status
                }));
                if (selectedStatus !== 'All Status') {
                    arr = arr.filter(item => item.status === selectedStatus);
                }
                if (selectedSeverity !== 'All Severity') {
                    arr = arr.filter(item => {
                        return (item.severity || '').toLowerCase() === selectedSeverity.toLowerCase();
                    });
                }
                setAlerts(arr);

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
    }, [selectedStatus, selectedSeverity]);

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
            if (err?.response?.data?.message) { msg = err.response.data.message; }
            if (msg.toLowerCase().includes('already acknowledged')) { msg = 'Alert sudah di-acknowledge.'; }
            setErrorMessage(msg);
            fetchAlerts();
        }
    };

    const handleExportCSV = () => {
        if (alerts.length === 0) {
            alert("Tidak ada data untuk diekspor.");
            return;
        }
        const headers = ["Priority,Status,Details,Equipment,Location,Time\n"];
        const rows = alerts.map(item => {
            const priority = item.priority || 'P1';
            const status = item.status;
            const detail = (item.title || item.description || item.detail || "N/A").replace(/,/g, ' ');
            const equipment = (item.machine_name || item.sensor_reading?.machine?.name || item.sensor_reading?.machine_serial || '-').replace(/,/g, ' ');
            const location = (item.location || '-').replace(/,/g, ' ');
            const time = item.created_at ? new Date(item.created_at).toLocaleString() : '-';
            return `${priority},${status},${detail},${equipment},${location},${time}`;
        });
        const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Alert_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Alert Management</h1>
            <p className="text-gray-500 mb-4">Monitor all equipment alerts across your facility</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow p-5 border border-gray-200">
                    <div className="text-gray-500 text-sm font-medium">Total Active</div>
                    <div className="text-2xl font-bold mt-1">{summary.total}</div>
                </div>
                <div className="bg-white rounded-xl shadow p-5 border border-red-100">
                    <div className="text-red-500 text-sm font-medium">Critical</div>
                    <div className="text-2xl font-bold mt-1 text-red-600">{summary.critical}</div>
                </div>
                <div className="bg-white rounded-xl shadow p-5 border border-yellow-100">
                    <div className="text-yellow-500 text-sm font-medium">Warning</div>
                    <div className="text-2xl font-bold mt-1 text-yellow-600">{summary.warning}</div>
                </div>
                <div className="bg-white rounded-xl shadow p-5 border border-green-100">
                    <div className="text-green-500 text-sm font-medium">Resolved</div>
                    <div className="text-2xl font-bold mt-1 text-green-600">{summary.resolved}</div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center mb-4">
                <FilterDropdown options={statusOptions} selectedOption={selectedStatus} onSelect={setSelectedStatus} />
                <FilterDropdown options={severityOptions} selectedOption={selectedSeverity} onSelect={setSelectedSeverity} />
                <button onClick={handleExportCSV} className="ml-auto px-4 py-2 bg-gray-100 rounded text-sm font-medium border hover:bg-gray-200">Export Report</button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border overflow-x-auto">
                {loading ? ( <div>Loading...</div> ) : alerts.length === 0 ? ( <div>No alerts found.</div> ) : (
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-600 border-b">
                                <th className="py-3 px-3">Priority</th>
                                <th className="py-3 px-3">Status</th>
                                <th className="py-3 px-3">Alert Details</th>
                                <th className="py-3 px-3">Equipment</th>
                                <th className="py-3 px-3">Time</th>
                                <th className="py-3 px-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.map(item => ( // FITUR: Menampilkan semua data alert di page ini
                                <tr key={item.id} className="border-b hover:bg-gray-50 align-top">
                                    <td className="py-4 px-3"><span className={`px-2 py-1 rounded text-xs font-bold ${item.priority === 'P1' ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}>{item.priority || 'P1'}</span></td>
                                    <td className="py-4 px-3"><span className="text-xs font-bold uppercase">{item.status}</span></td>
                                    <td className="py-4 px-3">
                                        <div className="font-bold text-gray-800">{item.title || item.description || "N/A"}</div>
                                        <div className="text-xs text-gray-500">{item.description}</div>
                                    </td>
                                    <td className="py-4 px-3 font-semibold text-blue-700">{item.machine_name || item.sensor_reading?.machine?.name || '-'}</td>
                                    <td className="py-4 px-3 text-gray-500">{item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : '-'}</td>
                                    <td className="py-4 px-3 text-right">
                                        {!item.acknowledged_by && (
                                            <button onClick={() => handleAcknowledge(item)} className="px-3 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700 hover:bg-purple-200 mr-2">Ack</button>
                                        )}
                                        <button onClick={() => setSelectedAlertId(item.id)} className="bg-gray-100 px-3 py-1 rounded text-xs font-bold">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {selectedAlertId && <AlertDetailModal alertId={selectedAlertId} onClose={() => setSelectedAlertId(null)} />}
        </div>
    );
}

export default AlertsPage;