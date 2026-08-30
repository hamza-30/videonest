import { useEffect } from "react";
import useVideos from "../hooks/useVideos";
import VideoCard from "./VideoCard";
import VideoCardSkeleton from "./VideoCardSkeleton";

function VideosSection({ channelId }) {
  const { getChannelVideos, videos, loading } = useVideos(channelId);

  useEffect(() => {
    if (!channelId) return;
    const getVideos = async () => {
      await getChannelVideos();
    };

    getVideos();
  }, [channelId]);

  if (!loading && channelId && videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#8132e5]/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-[#8132e5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z"
            />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-slate-800">
            No videos yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            This channel hasn't uploaded any videos yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 px-4 py-6 sm:grid-cols-2 sm:gap-3 sm:px-8 lg:grid-cols-3">
      {loading
        ? Array.from({ length: 3 }).map((_, i) => <VideoCardSkeleton key={i} />)
        : videos.map((video, index) => <VideoCard key={index} video={video} />)}
    </div>
  );
}

export default VideosSection;
