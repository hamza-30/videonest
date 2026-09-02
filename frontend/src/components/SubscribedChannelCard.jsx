import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { subscriptionService } from "../services/subscriptionService";
import { formatCompactNumber } from "../utils/formatCompactNumber";

function SubscribedChannelCard({ channel }) {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [subscribersCount, setSubscribersCount] = useState(
    channel?.subscribersCount ?? 0
  );
  const [loading, setLoading] = useState(false);

  const handleToggleSubscription = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      await subscriptionService.toggleSubscription(channel._id);
      const nextSubscribed = !isSubscribed;
      setIsSubscribed(nextSubscribed);
      setSubscribersCount((prev) => prev + (nextSubscribed ? 1 : -1));
    } catch (error) {
      toast.error(error.message || "Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/channel/${channel.username}`)}
      className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-3 sm:p-4 transition-colors duration-200 ease-out hover:bg-[#8032e515]"
    >
      {/* Left: Avatar & Channel Details */}
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <img
          src={channel?.avatar}
          alt={channel?.fullName}
          loading="lazy"
          decoding="async"
          className="h-12 w-12 shrink-0 rounded-full border border-gray-200 object-cover sm:h-14 sm:w-14"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-800 transition-colors hover:text-[#8132e5] sm:text-base">
            {channel?.fullName}
          </h3>
          <p className="truncate text-xs text-slate-500 sm:text-sm">
            @{channel?.username}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {formatCompactNumber(subscribersCount)}{" "}
            {subscribersCount === 1 ? "subscriber" : "subscribers"}
          </p>
        </div>
      </div>

      {/* Right: Subscribe / Subscribed Button */}
      <button
        type="button"
        disabled={loading}
        onClick={handleToggleSubscription}
        className={`shrink-0 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${
          isSubscribed
            ? "border border-gray-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
            : "bg-[#8132e5] text-white shadow-sm hover:bg-[#7026c8]"
        }`}
      >
        {loading ? "Updating..." : isSubscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}

export default memo(SubscribedChannelCard);
