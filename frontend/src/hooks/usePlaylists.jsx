import { useState, useCallback } from "react";
import { playlistService } from "../services/playlistService";

function usePlaylists(userId) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserPlayLists = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await playlistService.getUserPlaylists(userId);
      setPlaylists(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch playlists");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { playlists, loading, error, getUserPlayLists };
}

export default usePlaylists;
