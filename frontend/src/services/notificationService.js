import { apiClient } from "./api";

const API_BASE = import.meta.env.VITE_API_URL || "";

export const notificationService = {
  getNotifications: (page = 1, limit = 10) =>
    apiClient.get(`/api/v1/notifications?page=${page}&limit=${limit}`),

  getUnreadCount: () => apiClient.get("/api/v1/notifications/unread-count"),

  markAsRead: (upToId) =>
    apiClient.patch("/api/v1/notifications/read", { upToId }),

  createEventSource: () =>
    new EventSource(`${API_BASE}/api/v1/notifications/stream`, {
      withCredentials: true,
    }),
};
