import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useVideos from "../hooks/useVideos";
import SearchVideoCard from "../components/SearchVideoCard";
import SearchVideoCardSkeleton from "../components/SearchVideoCardSkeleton";
import { TbMovieOff } from "react-icons/tb";

function SearchResult() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const {
    videos,
    getChannelVideos: getSearchVideos,
    hasNextPage,
    isFetchingMore,
    loading,
    error,
    sentinelRef,
  } = useVideos({ query });

  useEffect(() => {
    if (query) {
      getSearchVideos();
    }
  }, [query]);

  return (
    <div className="p-4 sm:p-6 w-full">
      <div className="text-base sm:text-lg text-slate-900 mb-6">
        Showing results for <span className={`text-[#8132e5]`}>"{query}"</span>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && videos.length === 0 && query && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-4">
            <TbMovieOff className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-lg font-semibold text-slate-900">
            No results found
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Try different keywords or remove search filters
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:gap-6">
        {loading
          ? // Render 5 skeleton cards while loading
            [...Array(5)].map((_, i) => <SearchVideoCardSkeleton key={i} />)
          : // Render fetched videos
            videos.map((video) => (
              <SearchVideoCard key={video._id} video={video} />
            ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading spinner shown while fetching additional pages */}
      {isFetchingMore && (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#8132e5]" />
        </div>
      )}

      {/* End of results message */}
      {!hasNextPage && !loading && videos.length > 0 && (
        <p className="text-center text-sm text-gray-400 py-8">
          No more results
        </p>
      )}
    </div>
  );
}

export default SearchResult;
