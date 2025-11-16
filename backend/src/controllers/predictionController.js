export const getLatestPrediction = (req, res) => {
    res.json({
        machineId: 1,
        riskLevel: "Critical",
        message: "Mesin 1 kemungkinan overheating dalam 3 hari",
        predictedAt: new Date().toISOString()
    })
}