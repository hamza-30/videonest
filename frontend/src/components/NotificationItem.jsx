import { useNavigate } from "react-router-dom";
import { FaHeart, FaComment } from "react-icons/fa";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { useAuthContext } from "../context/auth/AuthContextProvider";

const typeConfig = {
  video_like: {
    message: "liked your video",
    icon: FaHeart,
    iconColor: "text-rose-500",
    badgeBg: "bg-rose-50",
  },
  comment_like: {
    message: "liked your comment",
    icon: FaHeart,
    iconColor: "text-rose-500",
    badgeBg: "bg-rose-50",
  },
  tweet_like: {
    message: "liked your tweet",
    icon: FaHeart,
    iconColor: "text-rose-500",
    badgeBg: "bg-rose-50",
  },
  video_comment: {
    message: "commented on your video",
    icon: FaComment,
    iconColor: "text-[#8132e5]",
    badgeBg: "bg-[#f3eefe]",
  },
};

const getEntityId = (val) =>
  typeof val === "object" && val !== null ? val._id : val;

function NotificationItem({ notification, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const { actor, type, isRead, createdAt } = notification;

  const title =
    notification.parentVideo?.title ||
    notification.targetDetails?.title ||
    notification.snapshot?.title;

  const content =
    notification.targetDetails?.content || notification.snapshot?.content;

  const thumbnail =
    notification.parentVideo?.thumbnail ||
    notification.targetDetails?.thumbnail ||
    notification.snapshot?.thumbnail;

  const config = typeConfig[type] || {
    message: "interacted with your content",
    icon: null,
    iconColor: "text-gray-500",
    badgeBg: "bg-gray-100",
  };

  const BadgeIcon = config.icon;

  const handleItemClick = () => {
    onClose?.();

    if (type === "video_like") {
      const videoId =
        getEntityId(notification.target) || notification.targetDetails?._id;
      if (videoId) navigate(`/watch/${videoId}`);
    } else if (type === "comment_like" || type === "video_comment") {
      const videoId =
        getEntityId(notification.parentTarget) || notification.parentVideo?._id;
      if (videoId) navigate(`/watch/${videoId}`);
    } else if (type === "tweet_like") {
      const channelUsername = user?.username || actor?.username;
      if (channelUsername) navigate(`/channel/${channelUsername}`);
      const tweetId =
        getEntityId(notification.target) || notification.targetDetails?._id;
      if (tweetId) {
        navigate(`/tweet/${tweetId}`);
      } else {
        const channelUsername = user?.username || actor?.username;
        if (channelUsername) navigate(`/channel/${channelUsername}`);
      }
    }
  };

  const handleActorClick = (e) => {
    e.stopPropagation();
    if (actor?.username) {
      onClose?.();
      navigate(`/channel/${actor.username}`);
    }
  };

  return (
    <div
      onClick={handleItemClick}
      className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-100/80 last:border-b-0 hover:bg-gray-50/90 active:bg-gray-100/70 ${
        !isRead ? "bg-[#faf7ff]" : "bg-white"
      }`}
    >
      {/* Actor avatar + Action badge */}
      <div className="relative shrink-0 mt-0.5">
        <img
          src={actor?.avatar}
          alt={actor?.fullName}
          onClick={handleActorClick}
          className="h-9 w-9 rounded-full object-cover transition-transform hover:scale-105"
        />
        {BadgeIcon && (
          <span
            className={`absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white ring-2 ring-white shadow-xs ${config.badgeBg}`}
          >
            <BadgeIcon className={`text-[8.5px] ${config.iconColor}`} />
          </span>
        )}
      </div>

      {/* Main message & details */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-snug text-gray-800 line-clamp-2">
          <span
            onClick={handleActorClick}
            className="font-semibold text-gray-900 hover:underline"
          >
            {actor?.fullName}
          </span>{" "}
          <span className="text-gray-600">{config.message}</span>
          {title && (
            <span className="font-medium text-gray-900">
              {" "}
              &quot;{title}&quot;
            </span>
          )}
        </p>

        {/* Comment quote snippet with single-line clamp */}
        {content && (
          <p className="mt-1 text-[12px] text-gray-600 line-clamp-1 italic bg-gray-50 border-l-2 border-[#8132e5]/40 pl-2 py-0.5 rounded-r">
            &ldquo;{content}&rdquo;
          </p>
        )}

        {/* Timestamp & unread dot */}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[11px] font-medium text-gray-400">
            {formatTimeAgo(createdAt)}
          </span>
          {!isRead && (
            <span className="h-1.5 w-1.5 rounded-full bg-[#8132e5]" />
          )}
        </div>
      </div>

      {/* Video Thumbnail (YouTube style) */}
      {thumbnail && (
        <div className="shrink-0 self-center">
          <img
            src={thumbnail}
            alt="Video preview"
            className="h-10 w-16 rounded-md object-cover border border-gray-200/70 shadow-2xs group-hover:opacity-90 transition-opacity"
          />
        </div>
      )}
    </div>
  );
}

export default NotificationItem;
