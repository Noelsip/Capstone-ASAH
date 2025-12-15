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
import { Cpu, Bell, Thermometer, Activity } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
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
        /**
         * ==============================
         * 1. NORMALISASI RESPONSE BACKEND
         * ==============================
         * Kita tidak boleh berasumsi struktur backend selalu lengkap.
         * Karena itu semua akses harus aman (defensive coding).
         */
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

        /**
         * ==============================
         * 2. STAT CARD (ANGKA RINGKAS)
         * ==============================
         * Untuk nilai rata-rata, kita ambil data TERAKHIR dari trend
         * agar konsisten dengan grafik.
         */
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

        /**
         * ==============================
         * 3. DATA GRAFIK (LINE CHART)
         * ==============================
         * Prinsip penting:
         * - Nilai 0 adalah DATA VALID
         * - Chart.js hanya butuh labels + datasets
         */
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
              },
            ],
          });
        } else {
          // Jika backend belum punya data sama sekali
          setTemperatureData(null);
          setVibrationData(null);
        }

        /**
         * ==============================
         * 4. RECENT ALERTS
         * ==============================
         */
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
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl px-2 md:px-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Predictive Maintenance Dashboard
        </h1>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* GRAFIK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Temperature Trends */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Temperature Trends
            </h3>
            <p className="text-sm text-gray-500 mb-4">Last 7 days</p>
            <div className="h-64 w-full">
              {temperatureData ? (
                <Line
                  data={temperatureData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true, position: "top" },
                    },
                  }}
                />
              ) : (
                <div className="text-gray-400 text-center pt-12">
                  No data available.
                </div>
              )}
            </div>
          </div>

          {/* Vibration Trends */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Vibration Trends
            </h3>
            <p className="text-sm text-gray-500 mb-4">Last 7 days</p>
            <div className="h-64 w-full">
              {vibrationData ? (
                <Line
                  data={vibrationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true, position: "top" },
                    },
                  }}
                />
              ) : (
                <div className="text-gray-400 text-center pt-12">
                  No data available.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RECENT ALERTS */}
        <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Alerts
            </h3>
            <span className="text-sm text-gray-500">
              {
                alerts.filter(
                  (a) => (a.severity || "").toLowerCase() === "critical"
                ).length
              }{" "}
              Critical
            </span>
          </div>

          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-gray-400 text-center">No recent alerts.</div>
            ) : (
              alerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  title={alert.alert_desc}
                  equipment={alert.machine_serial}
                  time={alert.created_at}
                  type={alert.severity}
                />
              ))
            )}
          </div>

          <button className="w-full mt-6 text-primary hover:text-primary-hover font-medium">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;