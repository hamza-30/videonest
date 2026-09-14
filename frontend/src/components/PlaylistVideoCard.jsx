import { memo, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { formatDuration } from "../utils/formatDuration";
import { formatCompactNumber } from "../utils/formatCompactNumber";
import { RiMoreLine, RiDeleteBinLine } from "react-icons/ri";

function PlaylistVideoCard({ video, isOwner, onRemove }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMenuClick = (e) => {
    e.stopPropagation(); // prevent navigation
    setMenuOpen((prev) => !prev);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation(); // prevent navigation
    setMenuOpen(false);
    if (onRemove) onRemove(video._id);
  };

  return (
    <div
      onClick={() => navigate(`/watch/${video._id}`)}
      className="flex flex-col sm:flex-row gap-3 rounded-xl p-2 transition-colors duration-200 ease-out hover:bg-gray-100 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full sm:w-40 md:w-48 shrink-0 rounded-xl overflow-hidden bg-slate-100">
        <img
          src={video.thumbnail}
          alt={video.title || "thumbnail"}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute px-1 bg-gray-800/90 right-1.5 bottom-1.5 rounded text-white text-xs">
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Info & Menu */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        {/* Title & Menu row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="text-[15px] font-medium line-clamp-2 text-gray-900 leading-tight">
            {video.title}
          </div>

          {/* Three-dot menu (Owner only) */}
          {isOwner && (
            <div ref={menuRef} className="relative shrink-0 -mt-1 -mr-1">
              <button
                onClick={handleMenuClick}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition"
                aria-label="Video options"
              >
                <RiMoreLine className="text-xl" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 z-50 w-49 rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-200/60">
                  <button
                    onClick={handleRemoveClick}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer rounded-[inherit]"
                  >
                    <RiDeleteBinLine className="text-base shrink-0" />
                    <span className="truncate">Remove from playlist</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Owner details */}
        <div className="text-xs sm:text-sm text-gray-600 truncate mb-1">
          {video.owner?.fullName || video.owner?.username || "Channel Name"}
        </div>

        {/* Views & Timestamp */}
        <div className="text-xs sm:text-sm text-gray-500">
          <span>{formatCompactNumber(video.views)} views</span>
          <span className="mx-1">•</span>
          <span>{formatTimeAgo(video.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(PlaylistVideoCard);
