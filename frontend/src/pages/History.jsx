import { useState, useEffect } from "react";
import { userService } from "../services/userService";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import DeleteModal from "../components/DeleteModal";
import { toast } from "react-hot-toast";

function History() {
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    const getHistory = async () => {
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

  const handleClearHistory = async () => {
    setClearing(true);
    try {
      await userService.clearWatchHistory();
      setVideos([]);
      setShowClearModal(false);
      toast.success("Watch history cleared");
    } catch (err) {
      toast.error(err.message || "Failed to clear history");
    } finally {
      setClearing(false);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Watch History</h1>

          {videos.length > 0 && !loading && (
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

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

      <DeleteModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearHistory}
        loading={clearing}
        title="Clear watch history?"
        description="All videos will be removed from your watch history. This action cannot be undone."
      />
    </>
  );
}

export default History;
