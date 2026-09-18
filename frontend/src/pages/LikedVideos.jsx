import { useState, useEffect } from "react";
import { likeService } from "../services/likeService";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import { toast } from "react-hot-toast";

function LikedVideos() {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      setLoading(true);
      try {
        const response = await likeService.getLikedVideos();
        const videos = response.data.map((like) => like.video);
        setLikedVideos(videos);
      } catch (err) {
        toast.error(err.message || "Failed to load liked videos");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  const handleRemoveLiked = async (videoId) => {
    // Optimistically remove from UI
    setLikedVideos((prev) => prev.filter((v) => v._id !== videoId));
    try {
      await likeService.toggleVideoLike(videoId);
    } catch (err) {
      toast.error(err.message || "Failed to remove video");
    }
  };

  return (
    <div className="p-4 sm:p-6 w-full">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Liked Videos</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : likedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {likedVideos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onRemove={handleRemoveLiked}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-slate-900">
            No liked videos yet
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Videos you like will appear here
          </p>
        </div>
      )}
    </div>
  );
}

export default LikedVideos;
