export const getLatestSensor = (req, res) => {
    res.json({
        machineId: 1,
        temperature: 83.2,
        vibration: 0.0031,
        pressure: 15.8,
        timestamp: new Date().toISOString()
    })
}