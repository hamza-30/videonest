import { useState, useCallback, useEffect, useRef } from "react";
import { videoService } from "../services/videoService";

function useVideos(channelId = null) {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 2: A ref for the invisible sentinel div at the bottom of the list
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

        // Step 1: Only pass userId if we have a channelId (channel page)
        // If no channelId, we fetch all videos (home feed)
        if (channelId) params.userId = channelId;

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
    [channelId]
  );

  // Step 3: Set up the IntersectionObserver to watch the sentinel div
  // When the sentinel enters the viewport, fetch the next page automatically
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

  const getChannelVideos = () => {
    fetchVideos(1);
  };

  return {
    videos,
    getChannelVideos,
    hasNextPage,
    isFetchingMore,
    loading,
    error,
    sentinelRef, // Step 4: returned so the component can attach it to the bottom div
  };
}

export default useVideos;
