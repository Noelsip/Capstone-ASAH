import fs from 'fs';
import fetch from 'node-fetch';

// Konfigurasi
const BASE_URL = 'http://localhost:3000';
const MACHINE_SERIALS = [
    'SN-001', 'SN-002', 'SN-003', 'SN-004', 'SN-005',
    'SN-006', 'SN-007', 'SN-008', 'SN-009', 'SN-010'
];
    const BATCH_SIZE = 50;
    const DELAY_MS = 500;

    // Helper delay
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // Fisher-Yates shuffle
    function shuffle(array) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
    }

    // Baca data testing.json
    const sensorData = JSON.parse(fs.readFileSync('./testing.json', 'utf-8'));

    // Acak urutan mesin untuk setiap data
    function assignRandomMachines(data, serials) {
    return data.map(item => ({
        ...item,
        machine_serial: serials[Math.floor(Math.random() * serials.length)]
    }));
    }

    // Modifikasi sebagian data agar ada critical/warning/normal
    function injectStatusVariasi(data) {
    return data.map((item, idx) => {
        // Setiap 5 data critical, 5 warning, sisanya normal
        if (idx % 15 === 0) {
        // Critical: tool_wear_min sangat tinggi, suhu tinggi
        return {
            ...item,
            Tool_wear_min: 240 + Math.floor(Math.random() * 10),
            air_temperature_k: 310 + Math.random() * 2,
            process_temperature_k: 318 + Math.random() * 2,
            torque_nm: 75 + Math.random() * 2
        };
        } else if (idx % 7 === 0) {
        // Warning: tool_wear_min menengah, suhu agak tinggi
        return {
            ...item,
            Tool_wear_min: 170 + Math.floor(Math.random() * 40),
            air_temperature_k: 305 + Math.random() * 2,
            process_temperature_k: 315 + Math.random() * 2,
            torque_nm: 60 + Math.random() * 5
        };
        } else {
        // Normal: random di range aman
        return {
            ...item,
            Tool_wear_min: item.Tool_wear_min,
            air_temperature_k: 298 + Math.random() * 4,
            process_temperature_k: 308 + Math.random() * 4,
            torque_nm: 40 + Math.random() * 10
        };
        }
    });
    }

    // 1. Login dan dapatkan token
    async function login() {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        email: 'tech1@gmail.com',
        password: 'password123'
        })
    });
    const data = await res.json();
    if (!data.token) throw new Error('Login gagal: ' + (data.error || JSON.stringify(data)));
    return data.token;
    }

    // 2. Batch insert sensor data
    async function insertSensorBatch(token, batch) {
    const readings = batch.map(item => ({
        machine_serial: item.machine_serial,
        air_temperature_k: item.air_temperature_k ?? (298 + Math.random() * 4),
        process_temperature_k: item.process_temperature_k ?? (308 + Math.random() * 4),
        rotational_speed_rpm: 1500 + Math.floor(Math.random() * 200),
        torque_nm: item.torque_nm ?? (40 + Math.random() * 10),
        tool_wear_min: item.Tool_wear_min
    }));

    const res = await fetch(`${BASE_URL}/sensor-data/batch`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ readings })
    });
    const data = await res.json();
    console.log(`Batch insert (${readings[0].machine_serial}): ${data.message || res.status}`);
    return readings;
    }

    // 3. Trigger predictions/analize untuk setiap data
    async function triggerPredictions(token, readings) {
    for (let i = 0; i < readings.length; i++) {
        const sensor = readings[i];
        const body = {
        machine_serial: sensor.machine_serial,
        sensor_data: {
            air_temperature_k: sensor.air_temperature_k,
            process_temperature_k: sensor.process_temperature_k,
            rotational_speed_rpm: sensor.rotational_speed_rpm,
            torque_nm: sensor.torque_nm,
            tool_wear_min: sensor.tool_wear_min
        }
        };
        const res = await fetch(`${BASE_URL}/predictions/analize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
        });
        const data = await res.json();
        console.log(`Prediction (${sensor.machine_serial}) #${i + 1}: ${data.message || res.status}`);
        await delay(DELAY_MS);
    }
    }

    // Main runner
    (async () => {
    try {
        const token = await login();
        console.log('Login sukses, mulai batch insert dan prediction...');

        // Acak mesin dan variasikan status data
        let randomizedData = assignRandomMachines(sensorData, MACHINE_SERIALS);
        randomizedData = injectStatusVariasi(randomizedData);
        randomizedData = shuffle(randomizedData);

        // Kelompokkan per mesin
        for (const serial of MACHINE_SERIALS) {
        const dataForMachine = randomizedData.filter(d => d.machine_serial === serial);
        for (let i = 0; i < dataForMachine.length; i += BATCH_SIZE) {
            const batch = dataForMachine.slice(i, i + BATCH_SIZE);
            if (batch.length === 0) continue;
            const readings = await insertSensorBatch(token, batch);
            await triggerPredictions(token, readings);
        }
        }

        console.log('Selesai semua batch dan predictions!');
    } catch (err) {
        console.error('Error:', err.message);
    }
})();