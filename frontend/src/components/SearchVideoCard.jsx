import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { formatDuration } from "../utils/formatDuration";
import { formatCompactNumber } from "../utils/formatCompactNumber";

function SearchVideoCard({ video }) {
  const navigate = useNavigate();

  const handleChannelClick = (e) => {
    e.stopPropagation();
    navigate(`/channel/${video.owner?.username}`);
  };

  return (
    <div
      onClick={() => navigate(`/watch/${video._id}`)}
      className="flex flex-col sm:flex-row gap-4 w-full cursor-pointer rounded-xl p-2 transition-colors duration-200 ease-out hover:bg-gray-50"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full sm:w-80 md:w-96 shrink-0 rounded-xl overflow-hidden bg-slate-100">
        <img
          src={video.thumbnail}
          alt={video.title || "thumbnail"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
        />
        <div className="absolute px-1.5 py-0.5 bg-black/80 right-2 bottom-2 rounded text-white text-xs font-medium">
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-medium text-slate-900 line-clamp-2 leading-tight mb-1">
          {video.title}
        </h3>

        {/* Views & Timestamp */}
        <div className="text-xs sm:text-sm text-slate-500 mb-3">
          <span>{formatCompactNumber(video.views)} views</span>
          <span className="mx-1.5">•</span>
          <span>{formatTimeAgo(video.createdAt)}</span>
        </div>

        {/* Channel Info */}
        <div
          onClick={handleChannelClick}
          className="flex items-center gap-2 mb-3 w-fit hover:opacity-80 transition-opacity"
        >
          <img
            src={video.owner?.avatar}
            alt={video.owner?.fullName}
            loading="lazy"
            className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover bg-slate-200"
          />
          <span className="text-xs sm:text-sm text-slate-600 font-medium hover:text-slate-900 transition-colors">
            {video.owner?.fullName || video.owner?.username}
          </span>
        </div>

        {/* Description Snippet (Hidden on very small screens) */}
        {video.description && (
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 hidden sm:block leading-relaxed">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(SearchVideoCard);

