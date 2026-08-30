import { useState } from "react";
import { videoService } from "../services/videoService";

function useVideos(channelId) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getChannelVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await videoService.getAllVideos({
        userId: channelId,
        sortBy: "createdAt",
        sortType: -1,
      });

      setVideos(response.data.docs);
    } catch (err) {
      setError(err.message || "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  return { videos, getChannelVideos, loading, error };
}

export default useVideos;
