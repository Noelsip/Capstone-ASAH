import { PrismaClient } from '../generated/prisma/index.js';
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

const acknowledgeAlert = async (req, res) => {
    try {
        const alertId = req.params.id;
        const userId = req.user.id;

        // Cek apakah alert ada
        const alert = await prisma.aLERTS.findUnique({ where: { id: alertId } });
        if (!alert) {
            return res.status(404).json({ message: 'Alert tidak ditemukan' });
        }

        // Cek apakah sudah pernah di-acknowledge
        const existing = await prisma.aLERT_ACKNOWLEDGEMENTS.findUnique({
            where: { alert_id: alertId }
        });
        if (existing) {
            return res.status(400).json({ message: 'Alert sudah di-acknowledge oleh user lain', acknowledged_by: existing.acknowledged_by });
        }

        // Simpan acknowledge
        await prisma.aLERT_ACKNOWLEDGEMENTS.create({
            data: {
                alert_id: alertId,
                acknowledged_by: userId,
                acknowledged_at: new Date()
            }
        });

        // Update status alert
        await prisma.aLERTS.update({
            where: { id: alertId },
            data: { status: 'acknowledged' }
        });

        res.status(200).json({
            message: 'Alert berhasil di-acknowledge',
            acknowledged_by: userId
        });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

const getAlertDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const alert = await prisma.aLERTS.findUnique({
            where: { id },
            include: {
                acknowledgements: { include: { user: true } },
                prediction: {
                    include: {
                        sensor_reading: {
                            include: {
                                machine: true
                            }
                        }
                    }
                }
            }
        });
        if (!alert) {
            return res.status(404).json({ message: 'Alert not found.' });
        }

        // Ambil acknowledged info
        const ack = alert.acknowledgements?.[0];
        const machine = alert.prediction?.sensor_reading?.machine;

        const mapped = {
            id: alert.id,
            status: alert.status,
            severity: alert.severity,
            priority: alert.priority,
            title: alert.title,
            description: alert.alert_desc,
            equipment: machine?.name || "-",
            location: machine?.location || "-",
            acknowledged_by: ack?.user?.name || "-",
            acknowledged_at: ack?.acknowledged_at
                ? new Date(ack.acknowledged_at).toLocaleString('en-GB', { hour12: false })
                : "-",
            created_at: alert.created_at
                ? new Date(alert.created_at).toLocaleString('en-GB', { hour12: false })
                : "-"
        };

        res.status(200).json({ data: stringifyBigInts(mapped) });
    } catch (error) {
        console.error('Get Alert Detail Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

export default {
    acknowledgeAlert,
    getAlertDetail
};