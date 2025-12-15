import api from "./apiClient";

export const health = () => api.get("/health");