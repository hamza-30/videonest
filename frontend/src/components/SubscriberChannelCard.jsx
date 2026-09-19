import { memo } from "react";
import { useNavigate } from "react-router-dom";

function SubscriberChannelCard({ channel }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/channel/${channel.username}`)}
      className="flex w-full cursor-pointer items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 sm:p-4 transition-colors duration-200 ease-out hover:bg-[#8032e515]"
    >
      {/* Avatar */}
      <img
        src={channel?.avatar}
        alt={channel?.fullName}
        loading="lazy"
        decoding="async"
        className="h-12 w-12 shrink-0 rounded-full border border-gray-200 object-cover sm:h-14 sm:w-14"
      />

      {/* Channel Details */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-800 transition-colors hover:text-[#8132e5] sm:text-base">
          {channel?.fullName}
        </h3>
        <p className="truncate text-xs text-slate-500 sm:text-sm">
          @{channel?.username}
        </p>
      </div>
    </div>
  );
}

export default memo(SubscriberChannelCard);
