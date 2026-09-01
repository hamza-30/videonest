import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { RiPlayListLine } from "react-icons/ri";

function PlayListCard({ playlist }) {
  const navigate = useNavigate();
  const { thumbnail, videoCount = 0 } = playlist;

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist._id}`)}
      className="flex min-w-0 w-full cursor-pointer flex-col gap-y-3 rounded-xl p-2 transition-colors duration-200 ease-out hover:bg-[#8032e525]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-200 bg-slate-100">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={playlist.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#8132e5]/10 to-[#8132e5]/5">
            <RiPlayListLine className="h-12 w-12 text-[#8132e5]/40" />
          </div>
        )}

        {/* Video count badge */}
        <div className="absolute bottom-0 right-0 flex items-center gap-1.5 rounded-tl-xl bg-gray-900/80 px-3 py-1.5 backdrop-blur-sm">
          <RiPlayListLine className="h-3.5 w-3.5 text-white" />
          <span className="text-[13px] font-medium text-white">
            {videoCount} {videoCount === 1 ? "video" : "videos"}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 px-1 pb-1">
        <p className="text-[15px] font-medium leading-snug line-clamp-2 text-slate-800">
          {playlist.name}
        </p>
        {playlist.description && (
          <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">
            {playlist.description}
          </p>
        )}
        <p className="mt-1.5 text-xs font-medium text-[#8132e5]">
          View full playlist
        </p>
      </div>
    </div>
  );
}

export default memo(PlayListCard);
