import React, { useEffect, useState } from 'react';
import { getAlertDetail } from '../../api/predictions';
import { formatDistanceToNow, format } from 'date-fns';

function AlertDetailModal({ alertId, onClose }) {
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAlertDetail(alertId)
            .then(res => setAlert(res && res.data ? res.data : null))
            .catch(() => setAlert(null))
            .finally(() => setLoading(false));
    }, [alertId]);

    // Helper untuk format waktu
    const formatTime = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        if (isNaN(date)) return '-';
        return `${formatDistanceToNow(date, { addSuffix: true })} (${format(date, 'yyyy-MM-dd HH:mm')})`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                {loading ? (
                    <div className="text-center py-12 text-lg text-gray-500">Loading...</div>
                ) : !alert ? (
                    <div className="text-center py-12 text-red-500 font-semibold">Alert not found.</div>
                ) : (
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="uppercase text-xs font-bold px-2 py-1 rounded bg-gray-200 text-gray-700">{alert.priority || '-'}</span>
                            <span className="uppercase text-xs font-bold px-2 py-1 rounded bg-purple-200 text-purple-700">{alert.severity || '-'}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-auto ${
                                alert.status === 'normal'
                                    ? 'bg-green-100 text-green-700'
                                    : alert.status === 'Acknowledged'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-red-100 text-red-600'
                            }`}>
                                {alert.status}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{alert.title || 'No Title'}</h2>
                        <div className="mb-4 text-gray-600">{alert.description || 'No description available.'}</div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Equipment:</span>
                            <span className="text-blue-700">{alert.equipment || alert.machine_name || '-'}</span>
                        </div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Location:</span>
                            <span>{alert.location || '-'}</span>
                        </div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Acknowledged By:</span>
                            <span>
                                {alert.acknowledged_by
                                    ? <span className="font-semibold text-purple-700">{alert.acknowledged_by}</span>
                                    : <span className="text-gray-400">-</span>
                                }
                            </span>
                        </div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Acknowledged At:</span>
                            <span>
                                {alert.acknowledged_at
                                    ? formatTime(alert.acknowledged_at)
                                    : <span className="text-gray-400">-</span>
                                }
                            </span>
                        </div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Created At:</span>
                            <span>{formatTime(alert.created_at)}</span>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary-dark transition"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AlertDetailModal;