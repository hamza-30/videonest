import { apiClient } from "./api";

export const likeService = {
  toggleVideoLike: (videoId) =>
    apiClient.post(`/api/v1/likes/toggle/v/${videoId}`),

  toggleCommentLike: (commentId) =>
    apiClient.post(`/api/v1/likes/toggle/c/${commentId}`),

  toggleTweetLike: (tweetId) =>
    apiClient.post(`/api/v1/likes/toggle/t/${tweetId}`),

  getLikedVideos: () => apiClient.get(`/api/v1/likes/videos`),
};
