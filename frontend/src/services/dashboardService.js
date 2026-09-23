import { apiClient } from "./api";

export const dashboardService = {
  getChannelStats: () => apiClient.get("/api/v1/dashboard/stats"),
  
  getChannelVideos: () => apiClient.get("/api/v1/dashboard/videos"),
};
