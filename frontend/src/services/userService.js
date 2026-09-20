import { apiClient } from "./api";

export const userService = {
  updateAccountDetails: (data) =>
    apiClient.patch("/api/v1/users/update-account", data),

  updateAvatar: (formData) =>
    apiClient.patch("/api/v1/users/avatar", formData, { isFormData: true }),

  updateCoverImage: (formData) =>
    apiClient.patch("/api/v1/users/cover-image", formData, {
      isFormData: true,
    }),

  changePassword: (data) =>
    apiClient.post("/api/v1/users/change-password", data),

  getWatchHistory: () => apiClient.get("/api/v1/users/watch-history"),
};
