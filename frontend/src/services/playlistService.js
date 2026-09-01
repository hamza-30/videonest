import { apiClient } from "./api";

export const playlistService = {
  getUserPlaylists: (userId) =>
    apiClient.get(`/api/v1/playlists/user/${userId}`),

  createPlaylist: (body) => apiClient.post(`/api/v1/playlists/`, body),

  getPlaylistById: (playlistId) =>
    apiClient.get(`/api/v1/playlists/${playlistId}`),

  updatePlaylist: (playlistId, body) =>
    apiClient.patch(`/api/v1/playlists/${playlistId}`, body),

  deletePlaylist: (playlistId) =>
    apiClient.delete(`/api/v1/playlists/${playlistId}`),

  addVideoToPlaylist: (videoId, playlistId) =>
    apiClient.patch(`/api/v1/playlists/add/${videoId}/${playlistId}`),

  removeVideoFromPlaylist: (videoId, playlistId) =>
    apiClient.patch(`/api/v1/playlists/add/${videoId}/${playlistId}`),
};
