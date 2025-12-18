import React, { useEffect, useState } from "react";
import StatCard from "../components/common/StatCard.jsx";
import AlertItem from "../components/common/AlertItem.jsx";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, Bell, Thermometer, Activity, ArrowRight } from "lucide-react"; // Tambahkan ArrowRight
import { getDashboardSummary, getDashboardTrends } from "../api/dashboard";

// Register komponen Chart.js agar grafik bisa dirender
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [temperatureData, setTemperatureData] = useState(null);
  const [vibrationData, setVibrationData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Saat pertama kali halaman dibuka, kita set loading
    setLoading(true);

    // Ambil summary dan trends secara paralel agar lebih efisien
    Promise.all([getDashboardSummary(), getDashboardTrends()])
      .then(([summaryRes, trendsRes]) => {
        const summary = summaryRes?.data || {};
        const trendsPayload = trendsRes?.data || {};

        // Backend mengirimkan trends dan recent_alerts di level root
        const trends = trendsPayload.trends || {};
        const recentAlerts = Array.isArray(trendsPayload.recent_alerts)
          ? trendsPayload.recent_alerts
          : [];

        console.log("SUMMARY:", summary);
        console.log("TRENDS:", trends);
        console.log("ALERTS:", recentAlerts);

        const statArr = [
          {
            id: "equipment_status",
            title: "Equipment Status",
            value: summary.equipment_status ?? "-",
            unit: "",
            icon: Cpu,
          },
          {
            id: "total_machines",
            title: "Total Machines",
            value: summary.total_machines ?? "-",
            unit: "",
            icon: Activity,
          },
          {
            id: "active_alerts",
            title: "Active Alerts",
            value: summary.active_alerts ?? recentAlerts.length,
            unit: "",
            icon: Bell,
          },
          {
            id: "avg_temperature",
            title: "Avg. Temperature",
            value:
              Array.isArray(trends.avg_temperature) &&
              trends.avg_temperature.length > 0
                ? trends.avg_temperature.at(-1)
                : "-",
            unit: "°C",
            icon: Thermometer,
          },
          {
            id: "avg_vibration",
            title: "Avg. Vibration",
            value:
              Array.isArray(trends.avg_vibration) &&
              trends.avg_vibration.length > 0
                ? trends.avg_vibration.at(-1)
                : "-",
            unit: "mm/s",
            icon: Activity,
          },
        ];

        setStats(statArr);

        if (Array.isArray(trends.labels) && trends.labels.length > 0) {
          setTemperatureData({
            labels: trends.labels,
            datasets: [
              {
                label: "Avg. Temperature (°C)",
                data: Array.isArray(trends.avg_temperature)
                  ? trends.avg_temperature
                  : [],
                tension: 0.3,
                fill: true,
                pointRadius: 3,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderColor: "rgb(59, 130, 246)",
              },
            ],
          });

          setVibrationData({
            labels: trends.labels,
            datasets: [
              {
                label: "Avg. Vibration (mm/s)",
                data: Array.isArray(trends.avg_vibration)
                  ? trends.avg_vibration
                  : [],
                tension: 0.3,
                fill: true,
                pointRadius: 3,
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderColor: "rgb(16, 185, 129)",
              },
            ],
          });
        } else {
          setTemperatureData(null);
          setVibrationData(null);
        }

        setAlerts(recentAlerts);
      })
      .catch((err) => {
        console.error("Dashboard load error:", err);
        setStats([]);
        setTemperatureData(null);
        setVibrationData(null);
        setAlerts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-7xl px-4 md:px-8 py-8 space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Predictive Maintenance Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Real-time equipment monitoring and anomaly detection</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-600">System Live</span>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* GRAFIK SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Temperature Trends */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-hover hover:shadow-md">
            <div className="flex items-center space-x-2 mb-4">
              <Thermometer className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-gray-800">Temperature Trends</h3>
            </div>
            <div className="h-64 w-full">
              {temperatureData ? (
                <Line
                  data={temperatureData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: false } }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
                  No temperature data recorded in the last 7 days.
                </div>
              )}
            </div>
          </div>

          {/* Vibration Trends */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-hover hover:shadow-md">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-gray-800">Vibration Trends</h3>
            </div>
            <div className="h-64 w-full">
              {vibrationData ? (
                <Line
                  data={vibrationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: false } }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
                  No vibration data recorded in the last 7 days.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RECENT NOTIFICATIONS / ALERTS LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Recent Notifications</h3>
                <p className="text-xs text-gray-500">Monitor latest system alerts and anomalies</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">
                {alerts.filter(a => (a.severity || "").toLowerCase() === "critical").length} Critical
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                {alerts.length} Total
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50/30">
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed">
                   <Bell className="w-12 h-12 mb-3 opacity-10" />
                   <p className="text-sm">Everything looks good. No active alerts.</p>
                </div>
              ) : (
                alerts.slice(0, 5).map((alert) => {
                  const equipmentSerial = alert.machine_serial || (alert.sensor_reading && alert.sensor_reading.machine_serial);
                  return (
                    <div 
                      key={alert.id} 
                      className="bg-white p-1 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-primary/20"
                      onClick={() => equipmentSerial && navigate(`/equipment/${equipmentSerial}`)}
                    >
                      <AlertItem
                        id={alert.id}
                        title={alert.alert_desc || alert.description}
                        equipment={equipmentSerial}
                        time={alert.created_at}
                        type={alert.severity}
                      />
                    </div>
                  )
                })
              )}
            </div>

            {alerts.length > 0 && (
              <button 
                onClick={() => navigate('/alerts')} 
                className="w-full mt-4 py-4 flex items-center justify-center space-x-2 text-primary hover:text-primary-hover font-bold text-sm bg-white rounded-xl border border-gray-200 transition-colors shadow-sm"
              >
                <span>View Full Notification History</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;