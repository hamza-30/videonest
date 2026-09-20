import { useState } from "react";
import { useEffect } from "react";
import { userService } from "../services/userService";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";

function History() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getHistory = async (params) => {
      setLoading(true);
      try {
        const response = await userService.getWatchHistory();
        setVideos(response.data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Failed to load watch history");
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, []);

  return (
    <>
      <div className="p-4 sm:p-6 w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Watch History
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Skeleton placeholders on initial load */}
          {loading &&
            [...Array(12)].map((_, i) => <VideoCardSkeleton key={i} />)}

          {/* Actual video cards */}
          {!loading &&
            videos.map((video) => <VideoCard key={video._id} video={video} />)}
        </div>

        {!loading && !error && videos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-semibold text-slate-900">
              Watch history is empty
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Videos that you watch will appear here
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default History;
