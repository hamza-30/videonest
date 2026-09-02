import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { formatDuration } from "../utils/formatDuration";
import { formatCompactNumber } from "../utils/formatCompactNumber";

function VideoCard({ video }) {
  const navigate = useNavigate();

  const handleChannelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={() => navigate(`/watch/${video._id}`)}
      className="flex min-w-0 w-full cursor-pointer flex-col gap-y-3 rounded-xl p-2 transition-colors duration-200 ease-out hover:bg-[#8032e525]"
    >
      <div className="relative aspect-video w-full border border-gray-200 rounded-2xl overflow-hidden bg-slate-100">
        <img
          src={video.thumbnail}
          alt={video.title || "thumbnail"}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute px-1 bg-gray-800/90 right-2.5 bottom-3 rounded-sm text-white text-[13px]">
          {formatDuration(video.duration)}
        </div>
      </div>

      <div className="flex gap-x-3">
        <Link
          to={`/channel/${video.owner?.username || video.owner}`}
          onClick={handleChannelClick}
          className="h-9.5 w-9.5 shrink-0 border border-gray-200 rounded-full overflow-hidden bg-slate-100"
        >
          <img
            src={video.owner?.avatar}
            alt={video.owner?.fullName || "avatar"}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-medium line-clamp-2">
            {video.title}
          </div>
          <Link
            to={`/channel/${video.owner?.username || video.owner}`}
            onClick={handleChannelClick}
            className="text-sm w-fit text-gray-600 relative bottom-0.5 mb-1 block hover:text-[#8132e5] active:text-[#8132e5] hover:underline active:underline truncate"
          >
            {video.owner?.fullName}
          </Link>
          <div className="text-sm text-gray-600">
            <span>{formatCompactNumber(video.views)} views</span>
            <span className="mx-1">•</span>
            <span>{formatTimeAgo(video.createdAt)} </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(VideoCard);
