import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * Mendapatkan semua mesin
 * GET /machines?status=active&location=Plant1
 */
export const getMachines = async (req, res) => {
    try {
        const { status, location, type } = req.query;

        const where = {};
        if (status) where.status = status;
        if (location) where.location = { contains: location, mode: 'insensitive' };
        if (type) where.product_type = { type_name: type };

        const machines = await prisma.mACHINES.findMany({
            where,
            include: {
                product_type: true,
                sensor_readings: {
                    orderBy: { reading_timestamp: 'desc' },
                    take: 1 // Hanya ambil sensor terbaru
                },
                _count: {
                    select: {
                        sensor_readings: true,
                        alerts: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        const serializedMachines = machines.map(machine => ({
            serial: machine.serial,
            product_id: machine.product_id,
            name: machine.name,
            type: machine.product_type.type_name,
            location: machine.location,
            status: machine.status,
            installed_at: machine.installed_at,
            last_maintenance: machine.last_maintenance,
            next_maintenance: machine.next_maintenance,
            created_at: machine.created_at,
            latest_sensor: machine.sensor_readings.length > 0 ? {
                timestamp: machine.sensor_readings[0].reading_timestamp,
                temperature: machine.sensor_readings[0].process_temperature_k,
                rpm: machine.sensor_readings[0].rotational_speed_rpm
            } : null,
            stats: {
                total_sensor_readings: machine._count.sensor_readings,
                total_alerts: machine._count.alerts
            }
        }));

        res.status(200).json({
            data: serializedMachines
        });

    } catch (error) {
        console.error('Get machines error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data mesin',
            error: error.message
        });
    }
};

/**
 * Mendapatkan detail mesin berdasarkan serial
 * GET /machines/:serial
 */
export const getMachineDetail = async (req, res) => {
    try {
        const { serial } = req.params;

        const machine = await prisma.mACHINES.findUnique({
            where: { serial },
            include: {
                product_type: true,
                sensor_readings: {
                    orderBy: { reading_timestamp: 'desc' },
                    take: 10 // 10 sensor readings terakhir
                },
                alerts: {
                    orderBy: { created_at: 'desc' },
                    take: 5 // 5 alerts terakhir
                },
                maintenance_logs: {
                    orderBy: { completed_at: 'desc' },
                    take: 5
                }
            }
        });

        if (!machine) {
            return res.status(404).json({
                message: 'Mesin tidak ditemukan'
            });
        }

        // Serialize sensor readings
        const serializedSensorReadings = machine.sensor_readings.map(reading => ({
            id: reading.id.toString(),
            timestamp: reading.reading_timestamp,
            air_temperature: reading.air_temperature_k,
            process_temperature: reading.process_temperature_k,
            rpm: reading.rotational_speed_rpm,
            torque: reading.torque_nm,
            tool_wear: reading.tool_wear_min
        }));

        res.status(200).json({
            data: {
                serial: machine.serial,
                product_id: machine.product_id,
                name: machine.name,
                type: machine.product_type,
                location: machine.location,
                status: machine.status,
                installed_at: machine.installed_at,
                last_maintenance: machine.last_maintenance,
                next_maintenance: machine.next_maintenance,
                created_at: machine.created_at,
                recent_sensors: serializedSensorReadings,
                recent_alerts: machine.alerts,
                recent_maintenance: machine.maintenance_logs
            }
        });

    } catch (error) {
        console.error('Get machine detail error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil detail mesin',
            error: error.message
        });
    }
};

/**
 * Update status mesin
 * PATCH /machines/:serial/status
 * Body: { status: 'active' | 'inactive' | 'maintenance' | 'warning' }
 */
export const updateMachineStatus = async (req, res) => {
    try {
        const { serial } = req.params;
        const { status } = req.body;

        const validStatuses = ['active', 'inactive', 'maintenance', 'warning'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: `Status harus salah satu dari: ${validStatuses.join(', ')}`
            });
        }

        const machine = await prisma.mACHINES.update({
            where: { serial },
            data: { status }
        });

        res.status(200).json({
            message: 'Status mesin berhasil diupdate',
            data: {
                serial: machine.serial,
                name: machine.name,
                status: machine.status
            }
        });

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                message: 'Mesin tidak ditemukan'
            });
        }

        console.error('Update machine status error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat update status mesin',
            error: error.message
        });
    }
};

export default {
    getMachines,
    getMachineDetail,
    updateMachineStatus
};