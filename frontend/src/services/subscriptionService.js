import { apiClient } from "./api";

export const subscriptionService = {
  toggleSubscription: (channelId) =>
    apiClient.post(`/api/v1/subscriptions/c/${channelId}`),

  getUserChannelSubscribers: (channelId) =>
    apiClient.get(`/api/v1/subscriptions/c/${channelId}`),

  getSubscribedChannels: (subscriberId) =>
    apiClient.get(`/api/v1/subscriptions/u/${subscriberId}`),
};
