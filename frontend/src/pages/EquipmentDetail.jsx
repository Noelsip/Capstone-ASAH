import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard.jsx';
import { Line } from 'react-chartjs-2';
import { getMachine } from '../api/machines';
import { getLatestSensor, getAggregated } from '../api/sensorData';
import { Wrench, Thermometer, Gauge, RotateCcw } from 'lucide-react'; 

function EquipmentDetailPage() {
    const { equipmentId } = useParams();
    const navigate = useNavigate();

    const [machine, setMachine] = useState(null);
    const [sensor, setSensor] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getMachine(equipmentId),
            getLatestSensor(equipmentId),
            getAggregated({
                machine_serial: equipmentId,
                interval: '1h',
                start_date: '2025-01-01',
                end_date: '2025-12-31'
            })
        ])
        .then(([m, s, c]) => {
            setMachine(m && m.data ? m.data : null);
            setSensor(s && s.data ? s.data : s);
            setChartData(
                Array.isArray(c)
                ? {
                    labels: c.map(item => item.timestamp),
                    datasets: [{
                        label: 'Temperature (K)',
                        data: c.map(item => item.process_temperature_k),
                        borderColor: '#1a73e8',
                        backgroundColor: 'rgba(26, 115, 232, 0.1)',
                        tension: 0.4,
                        pointRadius: 3,
                    }]
                  }
                : null
            );
        })
        .catch(() => {
            setMachine(null);
            setSensor(null);
            setChartData(null);
        })
        .finally(() => setLoading(false));
    }, [equipmentId]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!machine) return <div className="p-8 text-center text-red-500">Equipment not found.</div>;

    return (
        <div className="min-h-screen bg-bg-main p-4 md:p-8">
            <div className="bg-white rounded-2xl shadow-xl max-w-5xl mx-auto p-6 md:p-8 space-y-6 border border-gray-100">
                {/* HEADER */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {machine.name} ({machine.serial})
                        </h1>
                        <div className="flex items-center space-x-2 mt-1 text-sm">
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                {machine.status}
                            </span>
                            <span className="text-gray-600">
                                {typeof machine.type === 'object' ? machine.type.type_name : machine.type}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{machine.location}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/equipment')}
                        className="p-2 text-2xl rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                        title="Back to Equipment"
                    >
                        <RotateCcw size={20} />
                        
                    </button>
                </div>
                {/* METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Air Temp" value={sensor?.air_temperature_k} unit="K" />
                    <StatCard title="Proc. Temp" value={sensor?.process_temperature_k} unit="K" />
                    <StatCard title="Speed" value={sensor?.rotational_speed_rpm} unit="rpm" />
                    <StatCard title="Torque" value={sensor?.torque_nm} unit="Nm" />
                </div>
                {/* CHART */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Temperature Trend</h3>
                    <div className="h-64">
                        {chartData && <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />}
                        {!chartData && <div className="text-gray-400 text-center pt-12">No chart data available.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EquipmentDetailPage;