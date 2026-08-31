import { useEffect } from "react";
import useVideos from "../hooks/useVideos";
import VideoCard from "./VideoCard";
import VideoCardSkeleton from "./VideoCardSkeleton";
import { RiVideoOffLine } from "react-icons/ri";

function VideosSection({ channelId }) {
  const {
    getChannelVideos,
    videos,
    isFetchingMore,
    hasNextPage,
    fetchNextPage,
    loading,
  } = useVideos(channelId);

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
          <RiVideoOffLine className="h-10 w-10 text-[#8132e5]" />
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
    <>
      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 px-4 py-6 sm:grid-cols-2 sm:gap-3 sm:px-8 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))
          : videos.map((video) => <VideoCard key={video._id} video={video} />)}
      </div>

      {hasNextPage && !loading && (
        <div className="flex justify-center pb-8">
          <button
            onClick={fetchNextPage}
            disabled={isFetchingMore}
            className="rounded-lg border border-[#8132e5] px-6 py-2 text-sm font-medium text-[#8132e5] transition-colors hover:bg-[#8132e5] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}

export default VideosSection;
