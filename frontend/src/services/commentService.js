import { apiClient } from "./api";
import { buildQueryString } from "../utils/buildQueryString";

export const commentService = {
  getVideoComments: (videoId, params) => {
    const queryString = buildQueryString(params);
    return apiClient.get(`/api/v1/comments/${videoId}?${queryString}`);
  },

  addComment: (videoId, content) =>
    apiClient.post(`/api/v1/comments/${videoId}`, { content }),

  updateComment: (commentId, content) =>
    apiClient.patch(`/api/v1/comments/c/${commentId}`, { content }),

  deleteComment: (commentId) =>
    apiClient.delete(`/api/v1/comments/c/${commentId}`),
};
