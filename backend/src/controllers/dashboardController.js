import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

export const getDashboardSummary = async (req, res) => {
    try {
        // Total mesin
        const totalMachines = await prisma.mACHINES.count();

        // Mesin operational (status = 'active')
        const operationalMachines = await prisma.mACHINES.count({
            where: { status: 'active' }
        });

        // Persentase operational
        const equipmentStatus = totalMachines > 0 ? Math.round((operationalMachines / totalMachines) * 100) : 0;

        // Total alert aktif/kritis
        const activeAlerts = await prisma.aLERTS.count({
            where: {
                OR: [
                    { status: 'active' },
                    { status: 'open' },
                    { severity: 'critical' }
                ]
            }
        });

        // Rata-rata suhu mesin (dari sensor terbaru tiap mesin)
        const avgTempResult = await prisma.sENSOR_READINGS.aggregate({
            _avg: { process_temperature_k: true }
        });
        const avgTemperature = avgTempResult._avg.process_temperature_k || 0;

        // Rata-rata getaran (jika ada field, misal: vibration_mm_s)
        const avgVibrationResult = await prisma.sENSOR_READINGS.aggregate({
            _avg: { rotational_speed_rpm: true }
        });
        const avgVibration = avgVibrationResult._avg.rotational_speed_rpm || 0;

        res.status(200).json({
            data: {
                equipment_status: equipmentStatus, 
                total_machines: totalMachines,
                active_alerts: activeAlerts,
                avg_temperature: avgTemperature,
                avg_vibration: avgVibration
            }
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data dashboard',
            error: error.message
        });
    }
};

export const getDashboardTrends = async (req, res) => {
    try {
        const days = 7;
        const now = new Date();
        const labels = [];
        const avgTemps = [];
        const avgVibrations = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            const start = new Date(date.setHours(0,0,0,0));
            const end = new Date(date.setHours(23,59,59,999));
            labels.push(start.toISOString().slice(0,10));

            const tempAgg = await prisma.sENSOR_READINGS.aggregate({
                _avg: { process_temperature_k: true, rotational_speed_rpm: true },
                where: {
                    reading_timestamp: {
                        gte: start,
                        lte: end
                    }
                }
            });
            avgTemps.push(tempAgg._avg.process_temperature_k || 0);
            avgVibrations.push(tempAgg._avg.rotational_speed_rpm || 0);
        }

        // Recent alerts (5 terakhir, status aktif/kritis)
        const recentAlerts = await prisma.aLERTS.findMany({
            where: {
                OR: [
                    { status: { in: ['active', 'open'] } },
                    { severity: 'critical' }
                ]
            },
            orderBy: { created_at: 'desc' },
            take: 5,
            select: {
                id: true,
                machine_serial: true,
                severity: true,
                status: true,
                alert_desc: true,
                created_at: true
            }
        });

        res.status(200).json({
            trends: {
                labels,
                avg_temperature: avgTemps,
                avg_vibration: avgVibrations
            },
            recent_alerts: recentAlerts
        });
    } catch (error) {
        console.error('Dashboard trends error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data tren dashboard',
            error: error.message
        });
    }
};

export default {
    getDashboardSummary,
    getDashboardTrends
};
