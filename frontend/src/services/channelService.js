import { apiClient } from "./api";

export const channelService = {
  getUserChannel: (username) => apiClient.get(`/api/v1/users/c/${username}`),
  toggleSubscription: (channelId) =>
    apiClient.post(`/api/v1/subscriptions/c/${channelId}`),
};
