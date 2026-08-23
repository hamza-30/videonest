import { apiClient } from "./api";

export const authService = {
  login: (body) => apiClient.post("/api/v1/users/login", body),

  signup: (body) =>
    apiClient.post("/api/v1/users/register", body, { isFormData: true }),

  logout: () => apiClient.post("/api/v1/users/logout"),

  getCurrentUser: () => apiClient.get("/api/v1/users/current-user"),

  refreshToken: () => apiClient.post("/api/v1/users/refresh-token"),
};
