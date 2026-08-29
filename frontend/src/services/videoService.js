import { apiClient } from "./api";
import { buildQueryString } from "../utils/buildQueryString";

export const videoService = {
  getAllVideos: (params) => {
    const queryString = buildQueryString(params);
    return apiClient.get(`/api/v1/videos/${queryString}`);
  },

  getVideoById: (videoId) => apiClient.get(`/api/v1/videos/${videoId}`),

  uploadVideo: (body) =>
    apiClient.post(`/api/v1/videos/`, body, { isFormData: true }),

  updateVideo: (videoId, body) =>
    apiClient.patch(`/api/v1/videos/${videoId}`, body, { isFormData: true }),

  deleteVideo: (videoId) => apiClient.delete(`/api/v1/videos/${videoId}`),

  togglePublishStatus: (videoId) =>
    apiClient.patch(`/api/v1/videos/toggle/publish/${videoId}`),
};
