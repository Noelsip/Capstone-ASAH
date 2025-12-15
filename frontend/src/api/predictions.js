import api from "./apiClient";

export const analyzeWithNewSensor = (payload) => api.post("/predictions/analize", payload);
export const analyzeExisting = (machine_serial) => api.post("/predictions/analize", { machine_serial });
export const getPredictions = (params = {}) => api.get("/predictions", { params });
export const getLatestPrediction = (machine_serial) =>
    api.get("/predictions/latest", { params: { machine_serial } });
export const getAlertDetail = (id) => api.get(`/alerts/${id}`);
export const acknowledgeAlert = (id, user) =>
    api.post(`/alerts/${id}/acknowledge`, { user });