import { useEffect } from "react";
import useVideos from "../hooks/useVideos";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";

function Home() {
  // No channelId = fetch all videos (home feed)
  const {
    videos,
    getChannelVideos,
    hasNextPage,
    isFetchingMore,
    loading,
    error,
    sentinelRef,
  } = useVideos();

  // Fetch the first page on mount
  useEffect(() => {
    getChannelVideos();
  }, []);

  return (
    <div className="p-4 sm:p-6 w-full">
      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Skeleton placeholders on initial load */}
        {loading && [...Array(12)].map((_, i) => <VideoCardSkeleton key={i} />)}

        {/* Actual video cards */}
        {!loading &&
          videos.map((video) => <VideoCard key={video._id} video={video} />)}
      </div>

      {/* Empty State */}
      {!loading && !error && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-slate-900">No videos yet</p>
          <p className="text-sm text-slate-500 mt-2">
            Videos uploaded by channels you follow will appear here
          </p>
        </div>
      )}

      {/* 
        Step 4: The invisible sentinel div.
        IntersectionObserver in useVideos watches this element.
        When it scrolls into view, the next page is automatically fetched.
      */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading spinner shown while fetching additional pages */}
      {isFetchingMore && (
        <div className="flex justify-center py-6">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#8132e5]" />
        </div>
      )}

      {/* End of feed message */}
      {!hasNextPage && !loading && videos.length > 0 && (
        <p className="text-center text-sm text-gray-400 py-6">
          You've reached the end of feed
        </p>
      )}
    </div>
  );
}

export default Home;
