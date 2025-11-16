export const getMachines = (req, res) => {
    res.json([
        {
            id: 1,
            productId: "M00001",
            name: "Turbine 1",
            location: "Plant 1",
            runTime: "120h 30m",
            lastMaintenance: "2025-10-10T09:00:00Z",
            nextMaintenance: "2025-11-20T09:00:00Z",
            status: "active",
            createdAt: "2025-01-01T00:00:00Z"
        },
        {
            id: 2,
            productId: "M00002",
            name: "Generator 7",
            location: "Plant 2",
            runTime: "300h 10m",
            lastMaintenance: "2025-10-05T11:00:00Z",
            nextMaintenance: "2025-12-01T11:00:00Z",
            status: "inactive",
            createdAt: "2025-01-15T00:00:00Z"
        },
    ])
}