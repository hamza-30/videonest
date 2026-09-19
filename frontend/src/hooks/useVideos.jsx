import { useState, useCallback, useEffect, useRef } from "react";
import { videoService } from "../services/videoService";

function useVideos({ userId = null, query = null } = {}) {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sentinelRef = useRef(null);

  const fetchVideos = useCallback(
    async (pageNum) => {
      const isFirstPage = pageNum === 1;
      isFirstPage ? setLoading(true) : setIsFetchingMore(true);
      setError(null);

      try {
        const params = {
          sortBy: "createdAt",
          sortType: -1,
          page: pageNum,
          limit: 12,
        };

        if (userId) params.userId = userId;
        if (query) params.query = query;

        const response = await videoService.getAllVideos(params);
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
    [userId, query]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // entries[0] is our sentinel div
        // isIntersecting = true means the user scrolled to the bottom
        if (entries[0].isIntersecting && hasNextPage && !isFetchingMore) {
          fetchVideos(page + 1);
        }
      },
      { threshold: 0.1 } // Fire when 10% of the sentinel is visible
    );

    observer.observe(sentinel);
    return () => observer.disconnect(); // Cleanup on unmount
  }, [hasNextPage, isFetchingMore, page, fetchVideos]);

  const getChannelVideos = useCallback(() => {
    fetchVideos(1);
  }, [fetchVideos]);

  return {
    videos,
    getChannelVideos,
    hasNextPage,
    isFetchingMore,
    loading,
    error,
    sentinelRef,
  };
}

export default useVideos;
