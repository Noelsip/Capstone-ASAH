import api from "./apiClient";

export const createSensorData = (payload) => api.post("/sensor-data", payload);
export const batchCreateSensorData = (readings) => api.post("/sensor-data/batch", { readings });
export const getLatestSensor = (machine_serial) =>
  api.get("/sensor-data/latest", { params: { machine_serial } });
export const getSensorHistory = (params = {}) => api.get("/sensor-data", { params });
export const getAggregated = (params = {}) => api.get("/sensor-data/aggregated", { params });
export const getSensorStats = (params = {}) => api.get("/sensor-data/stats", { params });