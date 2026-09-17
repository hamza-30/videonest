import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { videoService } from "../services/videoService";
import { toast } from "react-hot-toast";
import VideoPlayer from "../components/VideoPlayer";
import VideoDetails from "../components/VideoDetails";

import { useAuthContext } from "../context/auth/AuthContextProvider";

import WatchSkeleton from "../components/WatchSkeleton";

import VideoCommentSection from "../components/VideoCommentSection";

function Watch() {
  const { videoId } = useParams();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const getVideo = async () => {
      setLoading(true);
      try {
        const response = await videoService.getVideoById(videoId);
        setVideo(response.data);
      } catch (err) {
        toast.error(err.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    getVideo();
  }, [videoId]);

  if (loading) {
    return <WatchSkeleton />;
  }

  if (!video) {
    return <p className="p-4">Video not found.</p>;
  }

  const isOwner = user?._id === video.owner?._id;

  return (
    <div className="p-5 max-w-300 mx-auto w-full flex flex-col gap-4">
      <VideoPlayer videoUrl={video.videoFile} thumbnail={video.thumbnail} />
      <VideoDetails video={video} isOwner={isOwner} />

      {/* Separator line */}
      <div className="h-px w-full bg-gray-200 my-2" />

      <VideoCommentSection videoId={videoId} />
    </div>
  );
}

export default Watch;
