import { useState } from "react";
import { Link } from "react-router-dom";
import {
  RiThumbUpLine,
  RiPlayListAddLine,
  RiThumbUpFill,
  RiCheckLine,
} from "react-icons/ri";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { formatCompactNumber } from "../utils/formatCompactNumber";
import SaveToPlaylistModal from "./SaveToPlaylistModal";
import { likeService } from "../services/likeService";
import { toast } from "react-hot-toast";
import { channelService } from "../services/channelService";

const CLAMP_THRESHOLD = 150;

function VideoDetails({ video, isOwner }) {
  const [descExpanded, setDescExpanded] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [likesCount, setLikesCount] = useState(video.likesCount || 0);

  const [isSubscribed, setIsSubscribed] = useState(video.isSubscribed || false);
  const [subscribersCount, setSubscribersCount] = useState(
    video.subscribersCount || 0
  );

  const handleSubscribe = async () => {
    setIsSubscribed((prev) => !prev);
    setSubscribersCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
    try {
      await channelService.toggleSubscription(video.owner?._id);
    } catch (err) {
      setIsSubscribed((prev) => !prev);
      setSubscribersCount((prev) => (isSubscribed ? prev + 1 : prev - 1));
      toast.error(err.message || "Failed to toggle subscription");
    }
  };

  const handleLike = async () => {
    // Optimistic update
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await likeService.toggleVideoLike(video._id);
    } catch (err) {
      // Revert on error
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      toast.error(err.message || "Failed to toggle like");
    }
  };

  // Description truncation logic
  const isDescLong = (video.description?.length || 0) > CLAMP_THRESHOLD;

  console.log(video);

  return (
    <div className="flex flex-col gap-4">
      {/* Video Title */}
      <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
        {video.title}
      </h1>

      {/* Action Row: Channel Info & Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Channel Info */}
        <div className="flex items-center gap-3">
          <Link
            to={`/channel/${video.owner?.username || video.owner}`}
            className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-slate-100 border border-gray-200"
          >
            <img
              src={video.owner?.avatar}
              alt={video.owner?.fullName || "avatar"}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <Link
              to={`/channel/${video.owner?.username || video.owner}`}
              className="text-base font-semibold text-gray-900 hover:text-gray-700"
            >
              {video.owner?.fullName || "Channel Name"}
            </Link>
            <span className="text-xs text-gray-500">
              {formatCompactNumber(subscribersCount)} subscriber
              {subscribersCount === 1 ? "" : "s"}
            </span>
          </div>

          {/* Subscribe Button */}
          {!isOwner && (
            <button
              onClick={handleSubscribe}
              className={`ml-3 px-4 py-2 flex items-center gap-1.5 text-sm font-medium rounded-full transition cursor-pointer ${
                isSubscribed
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  : "bg-[#8132e5] text-white hover:bg-[#6e28c8]"
              }`}
            >
              {isSubscribed && <RiCheckLine className="text-lg" />}
              <span>{isSubscribed ? "Subscribed" : "Subscribe"}</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition cursor-pointer shrink-0 ${
              isLiked
                ? "bg-[#8132e5] text-white hover:bg-[#6e28c8]"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {isLiked ? (
              <RiThumbUpFill className="text-lg" />
            ) : (
              <RiThumbUpLine className="text-lg" />
            )}
            <span>
              {likesCount > 0 ? formatCompactNumber(likesCount) : "Like"}
            </span>
          </button>

          {/* Save to Playlist */}
          <button
            onClick={() => setShowPlaylistModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-sm font-medium text-gray-800 hover:bg-gray-200 rounded-full transition cursor-pointer shrink-0"
          >
            <RiPlayListAddLine className="text-lg" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Description Box */}
      <div className="bg-gray-100 rounded-2xl p-3 sm:p-4 mt-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
          <span>{formatCompactNumber(video.views)} views</span>
          <span>•</span>
          <span>{formatTimeAgo(video.createdAt)}</span>
        </div>

        <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
          <p className={!descExpanded && isDescLong ? "line-clamp-3" : ""}>
            {video.description || "No description provided."}
          </p>

          {isDescLong && (
            <button
              onClick={() => setDescExpanded((prev) => !prev)}
              className="mt-1 font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              {descExpanded ? "Show less" : "...more"}
            </button>
          )}
        </div>
      </div>

      {/* Playlist Modal */}
      <SaveToPlaylistModal
        videoId={video._id}
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
      />
    </div>
  );
}

export default VideoDetails;
