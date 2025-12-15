import api from "./apiClient";

export const getMachines = (filters = {}) => api.get("/machines", { params: filters });
export const getMachine = (serial) => api.get(`/machines/${encodeURIComponent(serial)}`);
export const updateMachineStatus = (serial, status) =>
    api.patch(`/machines/${encodeURIComponent(serial)}/status`, { status });