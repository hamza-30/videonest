import { useState, useCallback } from "react";
import { videoService } from "../services/videoService";

function useVideos(channelId) {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = useCallback(
    async (pageNum) => {
      const isFirstPage = pageNum === 1;
      isFirstPage ? setLoading(true) : setIsFetchingMore(true);
      setError(null);

      try {
        const response = await videoService.getAllVideos({
          userId: channelId,
          sortBy: "createdAt",
          sortType: -1,
          page: pageNum,
          limit: 11,
        });

        const data = response.data;
        setVideos((prev) =>
          isFirstPage ? data.docs : [...prev, ...data.docs]
        );
        setHasNextPage(data.hasNextPage);
        setPage(pageNum);
      } catch (err) {
        setError(err.message || "Failed to fetch videos");
      } finally {
        isFirstPage ? setLoading(false) : setIsFetchingMore(false);
      }
    },
    [channelId]
  );

  const getChannelVideos = () => {
    fetchVideos(1);
  };

  const fetchNextPage = () => {
    if (!hasNextPage || isFetchingMore) return;
    fetchVideos(page + 1);
  };

  return {
    videos,
    getChannelVideos,
    fetchNextPage,
    hasNextPage,
    isFetchingMore,
    loading,
    error,
  };
}

export default useVideos;
