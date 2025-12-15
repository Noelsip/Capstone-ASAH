import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * Menyimpan data sensor baru (dari IoT device/frontend)
 * POST /sensor-data
 */
export const createSensorData = async (req, res) => {
    try {
        const {
            machine_serial,
            air_temperature_k,
            process_temperature_k,
            rotational_speed_rpm,
            torque_nm,
            tool_wear_min
        } = req.body;

        // Check if machine exists
        const machine = await prisma.mACHINES.findUnique({
            where: { serial: machine_serial }
        });

        if (!machine) {
            return res.status(404).json({
                status: 'error',
                message: 'Mesin tidak ditemukan'
            });
        }

        // Create sensor reading
        const sensorReading = await prisma.sENSOR_READINGS.create({
            data: {
                machine_serial,
                reading_timestamp: new Date(),
                air_temperature_k: air_temperature_k || null,
                process_temperature_k: process_temperature_k || null,
                rotational_speed_rpm: rotational_speed_rpm || null,
                torque_nm: torque_nm || null,
                tool_wear_min: tool_wear_min || null,
                raw_data: req.body // Store original request as JSON
            }
        });

        res.status(201).json({
            message: 'Data sensor berhasil disimpan',
            data: {
                id: sensorReading.id.toString(),
                machine_serial: sensorReading.machine_serial,
                timestamp: sensorReading.reading_timestamp,
                air_temperature: sensorReading.air_temperature_k,
                process_temperature: sensorReading.process_temperature_k,
                rpm: sensorReading.rotational_speed_rpm,
                torque: sensorReading.torque_nm,
                tool_wear: sensorReading.tool_wear_min
            }
        });

    } catch (error) {
        console.error('Create sensor data error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menyimpan data sensor',
            error: error.message
        });
    }
};

/**
 * Mendapatkan data sensor terbaru
 * GET /sensor-data/latest?machine_serial=xxx
 */
export const getLatestSensor = async (req, res) => {
    try {
        const { machine_serial } = req.query;

        if (!machine_serial) {
            return res.status(400).json({
                message: 'machine_serial query parameter diperlukan'
            });
        }

        const latestReading = await prisma.sENSOR_READINGS.findFirst({
            where: { machine_serial },
            orderBy: { reading_timestamp: 'desc' }
        });

        if (!latestReading) {
            return res.status(404).json({
                message: 'Tidak ada data sensor untuk mesin ini'
            });
        }

        res.status(200).json({
            data: {
                id: latestReading.id.toString(),
                machine_serial: latestReading.machine_serial,
                timestamp: latestReading.reading_timestamp,
                air_temperature: latestReading.air_temperature_k,
                process_temperature: latestReading.process_temperature_k,
                rpm: latestReading.rotational_speed_rpm,
                torque: latestReading.torque_nm,
                tool_wear: latestReading.tool_wear_min
            }
        });

    } catch (error) {
        console.error('Get latest sensor error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data sensor',
            error: error.message
        });
    }
};

/**
 * Mendapatkan history data sensor
 * GET /sensor-data?machine_serial=xxx&limit=100&offset=0&start_date=xxx&end_date=xxx
 */
export const getSensorHistory = async (req, res) => {
    try {
        const { 
            machine_serial, 
            limit = 50, 
            offset = 0,
            start_date,
            end_date
        } = req.query;

        if (!machine_serial) {
            return res.status(400).json({
                message: 'machine_serial query parameter diperlukan'
            });
        }

        // Build where clause
        const whereClause = {
            machine_serial
        };

        // Add date range filter if provided
        if (start_date || end_date) {
            whereClause.reading_timestamp = {};
            if (start_date) {
                whereClause.reading_timestamp.gte = new Date(start_date);
            }
            if (end_date) {
                whereClause.reading_timestamp.lte = new Date(end_date);
            }
        }

        // Get total count
        const total = await prisma.sENSOR_READINGS.count({
            where: whereClause
        });

        // Get readings
        const readings = await prisma.sENSOR_READINGS.findMany({
            where: whereClause,
            orderBy: { reading_timestamp: 'desc' },
            skip: parseInt(offset),
            take: parseInt(limit)
        });

        res.status(200).json({
            data: readings.map(r => ({
                id: r.id.toString(),
                machine_serial: r.machine_serial,
                timestamp: r.reading_timestamp,
                air_temperature: r.air_temperature_k,
                process_temperature: r.process_temperature_k,
                rpm: r.rotational_speed_rpm,
                torque: r.torque_nm,
                tool_wear: r.tool_wear_min
            })),
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                has_more: total > (parseInt(offset) + parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get sensor history error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil history sensor',
            error: error.message
        });
    }
};

/**
 * Batch insert data sensor (untuk bulk import)
 * POST /sensor-data/batch
 */
export const createBatchSensorData = async (req, res) => {
    try {
        const { readings } = req.body;

        // Validate all machines exist first
        const machineSerials = [...new Set(readings.map(r => r.machine_serial))];
        const machines = await prisma.mACHINES.findMany({
            where: {
                serial: { in: machineSerials }
            }
        });

        const existingSerials = new Set(machines.map(m => m.serial));
        const invalidSerials = machineSerials.filter(s => !existingSerials.has(s));

        if (invalidSerials.length > 0) {
            return res.status(404).json({
                message: 'Beberapa mesin tidak ditemukan',
                invalid_serials: invalidSerials
            });
        }

        // Create all readings
        const createPromises = readings.map(reading => 
            prisma.sENSOR_READINGS.create({
                data: {
                    machine_serial: reading.machine_serial,
                    reading_timestamp: new Date(),
                    air_temperature_k: reading.air_temperature_k || null,
                    process_temperature_k: reading.process_temperature_k || null,
                    rotational_speed_rpm: reading.rotational_speed_rpm || null,
                    torque_nm: reading.torque_nm || null,
                    tool_wear_min: reading.tool_wear_min || null,
                    raw_data: reading
                }
            })
        );

        const results = await Promise.all(createPromises);

        res.status(201).json({
            message: `${results.length} data sensor berhasil disimpan`,
            data: {
                count: results.length,
                readings: results.map(r => ({
                    id: r.id.toString(),
                    machine_serial: r.machine_serial,
                    timestamp: r.reading_timestamp
                }))
            }
        });

    } catch (error) {
        console.error('Create batch sensor error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menyimpan batch data sensor',
            error: error.message
        });
    }
};

/**
 * Get aggregated sensor data for charting/analytics
 * GET /sensor-data/aggregated?machine_serial=M001-A&interval=1h&start_date=2024-01-01&end_date=2024-01-31
 */
export const getAggregatedSensorData = async (req, res) => {
    try {
        const { 
            machine_serial, 
            interval = '1h', // 1m, 5m, 15m, 1h, 1d
            start_date,
            end_date
        } = req.query;

        if (!machine_serial) {
            return res.status(400).json({
                message: 'machine_serial query parameter diperlukan'
            });
        }

        if (!start_date || !end_date) {
            return res.status(400).json({
                message: 'start_date dan end_date query parameters diperlukan'
            });
        }

        // Map interval to PostgreSQL date_trunc unit or bucketing expression
        let groupBySQL;
        if (interval === '1m') {
            groupBySQL = `date_trunc('minute', reading_timestamp)`;
        } else if (interval === '5m' || interval === '15m') {
            const n = interval === '5m' ? 5 : 15;
            groupBySQL = `
                date_trunc('hour', reading_timestamp) +
                floor(extract(minute from reading_timestamp) / ${n}) * interval '${n} minutes'
            `;
        } else if (interval === '1h') {
            groupBySQL = `date_trunc('hour', reading_timestamp)`;
        } else if (interval === '1d') {
            groupBySQL = `date_trunc('day', reading_timestamp)`;
        } else {
            return res.status(400).json({
                message: 'interval tidak valid. Pilih: 1m, 5m, 15m, 1h, atau 1d'
            });
        }

        // Use $queryRawUnsafe for dynamic SQL
        const sql = `
            SELECT 
                ${groupBySQL} AS time_bucket,
                AVG(air_temperature_k)::FLOAT AS avg_air_temp,
                AVG(process_temperature_k)::FLOAT AS avg_process_temp,
                AVG(rotational_speed_rpm)::FLOAT AS avg_rpm,
                AVG(torque_nm)::FLOAT AS avg_torque,
                AVG(tool_wear_min)::FLOAT AS avg_tool_wear,
                MIN(air_temperature_k)::FLOAT AS min_air_temp,
                MAX(air_temperature_k)::FLOAT AS max_air_temp,
                MIN(process_temperature_k)::FLOAT AS min_process_temp,
                MAX(process_temperature_k)::FLOAT AS max_process_temp,
                COUNT(*)::INT AS sample_count
            FROM sensor_readings
            WHERE machine_serial = $1
                AND reading_timestamp >= $2::timestamp
                AND reading_timestamp <= $3::timestamp
            GROUP BY time_bucket
            ORDER BY time_bucket ASC
        `;

        const result = await prisma.$queryRawUnsafe(
            sql,
            machine_serial,
            new Date(start_date),
            new Date(end_date)
        );

        res.status(200).json({
            data: result,
            metadata: {
                machine_serial,
                interval,
                start_date,
                end_date,
                total_buckets: result.length
            }
        });

    } catch (error) {
        console.error('Get aggregated sensor error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil aggregated data',
            error: error.message
        });
    }
};

/**
 * Get sensor statistics for a machine
 * GET /sensor-data/stats?machine_serial=M001-A&period=24h
 */
export const getSensorStats = async (req, res) => {
    try {
        const { 
            machine_serial,
            period = '24h' // 1h, 24h, 7d, 30d
        } = req.query;

        if (!machine_serial) {
            return res.status(400).json({
                status: 'error',
                message: 'machine_serial query parameter diperlukan'
            });
        }

        // Calculate start time based on period
        const periodMap = {
            '1h': 1 * 60 * 60 * 1000,
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000
        };

        const periodMs = periodMap[period];
        if (!periodMs) {
            return res.status(400).json({
                message: 'period tidak valid. Pilih: 1h, 24h, 7d, atau 30d'
            });
        }

        const startTime = new Date(Date.now() - periodMs);

        // Get statistics using aggregation
        const stats = await prisma.sENSOR_READINGS.aggregate({
            where: {
                machine_serial,
                reading_timestamp: {
                    gte: startTime
                }
            },
            _avg: {
                air_temperature_k: true,
                process_temperature_k: true,
                rotational_speed_rpm: true,
                torque_nm: true,
                tool_wear_min: true
            },
            _min: {
                air_temperature_k: true,
                process_temperature_k: true,
                rotational_speed_rpm: true,
                torque_nm: true,
                tool_wear_min: true
            },
            _max: {
                air_temperature_k: true,
                process_temperature_k: true,
                rotational_speed_rpm: true,
                torque_nm: true,
                tool_wear_min: true
            },
            _count: {
                id: true
            }
        });

        res.status(200).json({
            data: {
                machine_serial,
                period,
                start_time: startTime,
                end_time: new Date(),
                total_readings: stats._count.id,
                averages: {
                    air_temperature: stats._avg.air_temperature_k,
                    process_temperature: stats._avg.process_temperature_k,
                    rpm: stats._avg.rotational_speed_rpm,
                    torque: stats._avg.torque_nm,
                    tool_wear: stats._avg.tool_wear_min
                },
                minimums: {
                    air_temperature: stats._min.air_temperature_k,
                    process_temperature: stats._min.process_temperature_k,
                    rpm: stats._min.rotational_speed_rpm,
                    torque: stats._min.torque_nm,
                    tool_wear: stats._min.tool_wear_min
                },
                maximums: {
                    air_temperature: stats._max.air_temperature_k,
                    process_temperature: stats._max.process_temperature_k,
                    rpm: stats._max.rotational_speed_rpm,
                    torque: stats._max.torque_nm,
                    tool_wear: stats._max.tool_wear_min
                }
            }
        });

    } catch (error) {
        console.error('Get sensor stats error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil statistik sensor',
            error: error.message
        });
    }
};

export default {
    createSensorData,
    getLatestSensor,
    getSensorHistory,
    createBatchSensorData,
    getAggregatedSensorData,
    getSensorStats
};