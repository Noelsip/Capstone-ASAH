import apiClient from "./apiClient";

export const getDashboardSummary = () => apiClient.get("/dashboard/summary");
export const getDashboardTrends = () => apiClient.get("/dashboard/trends");