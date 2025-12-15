import { PrismaClient } from "../generated/prisma/index.js";
import mlService from "../services/mlService.js";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
dayjs.extend(relativeTime);

const prisma = new PrismaClient();

function stringifyBigInts(obj) {
    if (Array.isArray(obj)) {
        return obj.map(stringifyBigInts);
    } else if (obj && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (typeof obj[key] === 'bigint') {
                newObj[key] = obj[key].toString();
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                newObj[key] = stringifyBigInts(obj[key]);
            } else {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    }
    return obj;
}

/**
 * Membuat prediksi maintenance berdasarkan data sensor terbaru
 * POST /predictions/analyze
 * Body: {machine_serial: string, sensor_data?: object}
 */
const analyzeMaintenance = async (req, res) => {
    try {
        const { machine_serial, sensor_data } = req.body;

        if (!machine_serial) {
            return res.status(400).json({ message: 'machine_serial diperlukan' });
        }

        // Cek apakah mesin ada
        const machine = await prisma.mACHINES.findUnique({
            where: { serial: machine_serial },
            include: { product_type: true }
        });

        if (!machine) {
            return res.status(404).json({ message: 'Mesin tidak ditemukan' });
        }

        let sensorReading;

        // Jika sensor_data tidak diberikan, ambil data sensor terbaru
        if (!sensor_data) {
            sensorReading = await prisma.sENSOR_READINGS.findFirst({
                where: { machine_serial },
                orderBy: { reading_timestamp: 'desc' }
            });

            if (!sensorReading) {
                return res.status(404).json({ message: 'Tidak ada data sensor untuk mesin ini' });
            }
        } else {
            // Simpan sensor_data baru ke database
            sensorReading = await prisma.sENSOR_READINGS.create({
                data: {
                    machine_serial,
                    reading_timestamp: new Date(),
                    air_temperature_k: sensor_data.air_temperature_k,
                    process_temperature_k: sensor_data.process_temperature_k,
                    rotational_speed_rpm: sensor_data.rotational_speed_rpm,
                    torque_nm: sensor_data.torque_nm,
                    tool_wear_min: sensor_data.tool_wear_min,
                    raw_data: sensor_data
                }
            });
        }

        // MAPPING DATA KE FORMAT YANG DIHARAPKAN ML API
        const mlPayload = {
            UDI: sensorReading.id ? Number(sensorReading.id) : 1,
            Product_ID: String(machine.product_id || machine.serial || "UNKNOWN"),
            Type: machine.type || (machine.product_type?.type_code || "L"),
            Air_temperature_K: sensorReading.air_temperature_k,
            Process_temperature_K: sensorReading.process_temperature_k,
            Rotational_speed_rpm: sensorReading.rotational_speed_rpm,
            Torque_Nm: sensorReading.torque_nm,
            Tool_wear_min: sensorReading.tool_wear_min
        };

        // Kirim data ke ML model
        const mlResult = await mlService.predictMaintenance(mlPayload);

        if (!mlResult.success) {
            return res.status(503).json({
                message: 'ML service tidak tersedia',
                error: mlResult.error
            });
        }

        // Mapping sesuai response ML API
        const prediction = mlResult.data.binary?.prediction === 'FAILURE' ? 1 : 0;
        const confidence = mlResult.data.binary?.probability ?? 0.5;
        const failureTypeName = mlResult.data.multiclass?.failure_type ?? null;

        // Cari serial failure type jika ada
        let failureTypeSerial = null;
        if (failureTypeName) {
            const failureTypeRow = await prisma.fAILURE_TYPES.findFirst({
                where: { name: failureTypeName }
            });
            if (failureTypeRow) {
                failureTypeSerial = failureTypeRow.serial;
            }
        }

        // Menentukan severity berdasarkan confidence
        let severity = 'low';
        if (confidence >= 0.8) {
            severity = 'high';
        } else if (confidence >= 0.6) {
            severity = 'medium';
        }

        // Simpan hasil prediksi ke database
        const predictionRecord = await prisma.pREDICTIONS.create({
            data: {
                sensor_id: sensorReading.id,
                target: prediction,
                failure_type_serial: failureTypeSerial, 
                confidance_score: confidence,
                severity: severity,
                model_output: mlResult.data,
                predicted_at: new Date()
            }
        });

        // Jika prediksi menunjukkan potensi kerusakan (target=1), buat alert
        let alert = null;
        if (prediction === 1) {
            const alertId = `ALT-${Date.now()}-${machine_serial.substring(0, 8)}`;
            alert = await prisma.aLERTS.create({
                data: {
                    id: alertId,
                    prediction_id: predictionRecord.id,
                    machine_serial,
                    status: 'active',
                    priority: severity === 'high' ? 'high' : 'low',
                    severity: severity,
                    title: `Potensi Kerusakan Terdeteksi - ${machine.name || machine_serial}`,
                    alert_desc: `ML model mendeteksi potensi ${failureTypeName || 'kerusakan'} dengan confidence ${(confidence * 100).toFixed(2)}%`,
                    created_by: req.user?.id || null
                }
            });
        }

        // Update status mesin
        await prisma.mACHINES.update({
            where: { serial: machine_serial },
            data: {
                status: predictionRecord.target === 1 ? 'critical' : 'normal'
            }
        });

        res.status(200).json({
            message: 'Analisis prediksi berhasil',
            data: {
                machine: {
                    serial: machine.serial,
                    name: machine.name,
                    type: machine.product_type?.type_name || machine.type || null,
                    location: machine.location,
                    status: predictionRecord.target === 1 ? 'warning' : 'normal'
                },
                sensor_reading: {
                    id: sensorReading.id.toString(),
                    timestamp: sensorReading.reading_timestamp,
                    temperature: sensorReading.process_temperature_k,
                    rpm: sensorReading.rotational_speed_rpm,
                    torque: sensorReading.torque_nm,
                    tool_wear: sensorReading.tool_wear_min
                },
                prediction: {
                    id: predictionRecord.id.toString(),
                    needs_maintenance: predictionRecord.target === 1,
                    failure_type: failureTypeName,
                    confidence: confidence,
                    severity: predictionRecord.severity,
                    predicted_at: predictionRecord.predicted_at
                },
                alert: alert ? {
                    id: alert.id,
                    status: alert.status,
                    priority: alert.priority,
                    title: alert.title,
                    description: alert.alert_desc
                } : null,
                ml_response: mlResult.data
            }
        });
    } catch (error) {
        console.error('Analyze Maintenance Error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

/**
 * Mendapatkan semua prediksi dengan filter
 * GET /predictions?machine_serial=xxx&severity=high&limit=10
 */
const getPredictions = async (req, res) => {
    try {
        const { machine_serial, severity, limit = 50, offset = 0 } = req.query;

        const where = {};
        if (machine_serial) {
            where.sensor_reading = { machine_serial };
        }
        if (severity) {
            where.severity = severity;
        }

        const predictions = await prisma.pREDICTIONS.findMany({
            where,
            include: {
                sensor_reading: {
                    include: {
                        machine: { include: { product_type: true } }
                    }
                },
                failure_type: true,
                alert: {
                    include: {
                        acknowledgements: {
                            include: { user: true }
                        }
                    }
                }
            },
            orderBy: { predicted_at: 'desc' },
            skip: parseInt(offset),
            take: parseInt(limit)
        });

        const total = await prisma.pREDICTIONS.count({ where });

        // Convert BigInt to String
        const serializedPredictions = predictions.map(pred => {
            const machine = pred.sensor_reading?.machine;
            const alert = Array.isArray(pred.alert) ? pred.alert[0] : pred.alert;
            const acknowledged = alert?.status === 'acknowledged' || (alert?.acknowledgements?.length > 0);
            const acknowledgedBy = alert?.acknowledgements?.[0]?.user?.name || null;

            return {
                ...pred,
                id: pred.id.toString(),
                sensor_id: pred.sensor_id ? pred.sensor_id.toString() : null,
                sensor_reading: pred.sensor_reading ? {
                    ...pred.sensor_reading,
                    id: pred.sensor_reading.id.toString()
                } : null,
                title: alert?.title,
                status: acknowledged ? 'acknowledged' : (alert?.status || machine?.status || "-"),
                severity: alert?.severity || pred.severity,
                acknowledged_by: acknowledgedBy,
                machine_name: machine?.name || "-",
                location: machine?.location || "-",
                alert_id: alert?.id || null
            };
        });

        res.status(200).json({
            data: stringifyBigInts(serializedPredictions),
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                has_more: total > parseInt(offset) + parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Get Predictions Error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

/**
 * Mendapatkan prediksi terbaru
 * GET /predictions/latest?machine_serial=xxx
 */
const getLatestPrediction = async (req, res) => {
    try {
        const { machine_serial } = req.query;

        const where = {};
        if (machine_serial) {
            where.sensor_reading = { machine_serial };
        }

        const prediction = await prisma.pREDICTIONS.findFirst({
            where,
            include: {
                sensor_reading: {
                    include: {
                        machine: { include: { product_type: true } }
                    }
                },
                failure_type: true,
                alert: true
            },
            orderBy: { predicted_at: 'desc' }
        });

        if (!prediction) {
            return res.status(404).json({ message: 'Prediksi tidak ditemukan' });
        }

        // Convert BigInt to String
        const serializedPrediction = {
            ...prediction,
            id: prediction.id.toString(),
            sensor_id: prediction.sensor_id ? prediction.sensor_id.toString() : null,
            sensor_reading: prediction.sensor_reading ? {
                ...prediction.sensor_reading,
                id: prediction.sensor_reading.id.toString()
            } : null
        };

        res.status(200).json({ data: serializedPrediction });
    } catch (error) {
        console.error('Get Latest Prediction Error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

/**
 * GET detail prediction
 */
const getPredictionDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const predictions = await prisma.pREDICTIONS.findMany({
            where,
            include: {
                sensor_reading: {
                    include: {
                        machine: { include: { product_type: true } }
                    }
                },
                failure_type: true,
                alert: {
                    include: {
                        acknowledgements: {
                            include: { user: true }
                        }
                    }
                }
            },
            orderBy: { predicted_at: 'desc' },
            skip: parseInt(offset),
            take: parseInt(limit)
        });
        if (!prediction) {
            return res.status(404).json({ message: 'Prediksi tidak ditemukan' });
        }

        const alert = prediction.alert;
        const machine = prediction.sensor_reading?.machine;
        const createdAt = alert?.created_at ? dayjs(alert.created_at) : (prediction.predicted_at ? dayjs(prediction.predicted_at) : null);

        // Timeline dari alert.history jika ada
        let timeline = undefined;
        if (alert?.history && Array.isArray(alert.history) && alert.history.length > 0) {
            timeline = alert.history.map(h => ({
                title: h.title || h.status || "Event",
                time: h.created_at ? dayjs(h.created_at).fromNow() : null
            }));
        }

        // related_alerts hanya jika ada logic pencarian alert terkait, jika tidak, kosongkan saja
        let related_alerts = undefined;

        const mapped = {
            id: alert?.id || prediction.id.toString(),
            code: alert?.id || "-",
            priority: alert?.priority || "-",
            severity: alert?.severity || "-",
            status: alert?.status || machine?.status || "-",
            title: alert.title,
            description: alert?.alert_desc || prediction.failure_type?.desc || null,
            equipment: machine?.name || "-",
            location: machine?.location || "-",
            time: createdAt ? createdAt.fromNow() : null,
            ...(timeline ? { timeline } : {}),
            ...(related_alerts ? { related_alerts } : {})
        };

        res.status(200).json({ data: mapped });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

export default {
    analyzeMaintenance,
    getPredictions,
    getLatestPrediction,
    getPredictionDetail
};