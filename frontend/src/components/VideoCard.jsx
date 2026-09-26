import { memo, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  RiMore2Fill,
  RiPlayListAddLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { formatDuration } from "../utils/formatDuration";
import { formatCompactNumber } from "../utils/formatCompactNumber";
import SaveToPlaylistModal from "./SaveToPlaylistModal";

function VideoCard({ video, onRemove }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChannelClick = (e) => {
    e.stopPropagation();
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleSaveToPlaylist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    setShowPlaylistModal(true);
  };

  const handleRemoveLiked = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    if (onRemove) onRemove(video._id);
  };

  return (
    <>
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
            {/* Title & Menu row */}
            <div className="flex items-start justify-between gap-1 mb-1.5">
              <div className="text-[15px] font-medium line-clamp-2 leading-snug">
                {video.title}
              </div>

              {/* Three-dot menu */}
              <div
                ref={menuRef}
                className="relative shrink-0 -mt-0.5 -mr-1 h-5"
              >
                <button
                  onClick={handleMenuClick}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-black/10 hover:text-gray-800 transition cursor-pointer"
                  aria-label="Video options"
                >
                  <RiMore2Fill className="text-lg" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-8 z-50 w-48 rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-200/60">
                    <button
                      onClick={handleSaveToPlaylist}
                      className="flex w-full items-center gap-2.5 rounded-t-xl px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <RiPlayListAddLine className="text-base text-gray-400" />
                      Save to playlist
                    </button>
                    {location.pathname === "/liked-videos" && (
                      <button
                        onClick={handleRemoveLiked}
                        className="flex w-full items-center gap-2.5 rounded-b-xl px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer border-t border-gray-100"
                      >
                        <RiDeleteBinLine className="text-base shrink-0" />
                        Remove from liked
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Link
              to={`/channel/${video.owner?.username || video.owner}`}
              onClick={handleChannelClick}
              className="text-sm w-fit max-w-full text-gray-600 mb-1 block hover:text-[#8132e5] active:text-[#8132e5] hover:underline active:underline truncate"
            >
              {video.owner?.fullName}
            </Link>
            <div className="text-sm text-gray-600">
              <span>
                {formatCompactNumber(video.views)}{" "}
                {video.views == 1 ? "view" : "views"}
              </span>
              <span className="mx-1">•</span>
              <span>{formatTimeAgo(video.createdAt)} </span>
            </div>
          </div>
        </div>
      </div>

      <SaveToPlaylistModal
        videoId={video._id}
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
      />
    </>
  );
}

export default memo(VideoCard);
