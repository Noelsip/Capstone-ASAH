import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard.jsx';
import { getMachine } from '../api/machines';
import { getLatestSensor, getAggregated } from '../api/sensorData';
import { Thermometer, Gauge, RotateCcw, ActivitySquare } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

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
            console.log('sensor', s && s.data ? s.data : s);
            console.log('machine', m && m.data ? m.data : m);

            const chartArr = Array.isArray(c?.data) ? c.data : (Array.isArray(c) ? c : []);
            // Gabungkan label dan value, filter hanya yang valid
            const validPoints = chartArr
                .map((item, idx) => {
                    let val = item.avg_process_temp ?? item.process_temperature_k;
                    if (typeof val === 'string') val = parseFloat(val);
                    if (typeof val !== 'number' || isNaN(val)) return null;
                    const label = item.time_bucket ?? item.timestamp ?? (idx + 1);
                    if (typeof label !== 'string' && typeof label !== 'number') return null;
                    return { label: String(label), value: val };
                })
                .filter(Boolean);

            const filteredPoints = validPoints.filter(
                p => typeof p.value === 'number' && !isNaN(p.value) && p.label !== undefined && p.label !== null
            );

            const labels = filteredPoints.map(p => p.label);
            const data = filteredPoints.map(p => p.value);

            if (
                labels.length > 0 &&
                data.length > 0 &&
                labels.length === data.length &&
                data.every(v => typeof v === 'number' && !isNaN(v))
            ) {
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Temperature (K)',
                            data,
                            borderColor: '#1a73e8',
                            backgroundColor: 'rgba(26, 115, 232, 0.1)',
                            tension: 0.3,
                            fill: true,
                            pointRadius: 2,
                        }
                    ]
                });
            } else {
                setChartData(null);
            }
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
                    <StatCard title="Air Temp" value={sensor?.air_temperature} unit="K" icon={Thermometer} />
                    <StatCard title="Proc. Temp" value={sensor?.process_temperature} unit="K" icon={Thermometer} />
                    <StatCard title="Speed" value={sensor?.rpm} unit="rpm" icon={Gauge} />
                    <StatCard title="Torque" value={sensor?.torque} unit="Nm" icon={ActivitySquare} />
                </div>
                {/* CHART */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Temperature Trend</h3>
                    <div className="h-64">
                        {chartData && chartData.labels && chartData.datasets && chartData.datasets[0] &&
                            Array.isArray(chartData.datasets[0].data) &&
                            chartData.datasets[0].data.length > 0 &&
                            chartData.datasets[0].data.every(v => typeof v === 'number' && !isNaN(v)) ? (
                            <Line
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: 'top' },
                                        title: { display: false },
                                    },
                                    scales: {
                                        x: { display: true, title: { display: false } },
                                        y: { display: true, title: { display: true, text: 'Temperature (K)' } }
                                    }
                                }}
                                height={250}
                            />
                        ) : (
                            <div className="text-gray-400 text-center pt-12">No chart data available.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EquipmentDetailPage;