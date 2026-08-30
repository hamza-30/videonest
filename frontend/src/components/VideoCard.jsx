import { Link } from "react-router-dom";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { formatDuration } from "../utils/formatDuration";
import { formatViews } from "../utils/formatViews";

function VideoCard({ video }) {
  return (
    <div className="flex min-w-0 w-full flex-col gap-y-3 rounded-xl p-2 transition-colors duration-200 ease-out hover:bg-[#8032e525]">
      <div
        className={`relative border border-gray-200 h-55 rounded-2xl overflow-hidden`}
      >
        <img
          src={video.thumbnail}
          alt="thumbnail"
          className={`h-full w-full object-cover`}
        />
        <div
          className={`absolute px-1 bg-gray-800 right-2.5 bottom-3 rounded-sm text-white text-[13px]`}
        >
          {formatDuration(video.duration)}
        </div>
      </div>

      <div className={`flex gap-x-3`}>
        <div
          className={`h-9.5 w-9.5 border border-gray-200 rounded-full overflow-hidden`}
        >
          <img
            src={video.owner.avatar}
            alt="avatar"
            className={`w-full h-full object-cover`}
          />
        </div>

        <div>
          <div className={`text-[15px] font-medium`}>{video.title}</div>
          <Link
            to={`/channel/${video.owner.username}`}
            className={`text-sm w-fit text-gray-600 relative bottom-0.5 mb-1 hover:text-[#8132e5] active:text-[#8132e5] hover:underline active:underline`}
          >
            {video.owner.fullName}
          </Link>
          <div className={`text-sm text-gray-600`}>
            <span>{formatViews(video.views)} views</span>
            <span className={`mx-1`}>•</span>
            <span>{formatTimeAgo(video.createdAt)} </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
