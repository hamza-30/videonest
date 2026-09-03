import { apiClient } from "./api";

export const tweetService = {
  getUserTweets: (userId) => apiClient.get(`/api/v1/tweets/user/${userId}`),

  createTweet: (body) => apiClient.post(`/api/v1/tweets/`, body),

  updateTweet: (tweetId, body) =>
    apiClient.patch(`/api/v1/tweets/${tweetId}`, body),

  deleteTweet: (tweetId) => apiClient.delete(`/api/v1/tweets/${tweetId}`),
};
