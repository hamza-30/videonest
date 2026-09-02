import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { channelService } from "../services/channelService";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import { useState } from "react";
import { formatCompactNumber } from "../utils/formatCompactNumber";

function ChannelInformation({ channel, loading, error, setChannel }) {
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const { user } = useAuthContext();

  return (
    <div>
      <div className={`h-48 min-w-full`}>
        {loading ? (
          <div
            className={`relative h-full w-full overflow-hidden bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse`}
            role="status"
            aria-label="Loading channel cover"
          >
            <div className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.8s_ease-in-out_infinite]" />
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center text-sm text-red-600">
            {error.message || "Unable to load channel"}
          </div>
        ) : channel ? (
          <img
            src={channel.coverImage}
            alt="cover-image"
            className={`h-full w-full object-cover`}
          />
        ) : null}
      </div>

      {loading ? (
        <div className="relative flex flex-col items-stretch gap-4 px-4 pb-5 pt-20 sm:flex-row sm:items-center sm:px-8 sm:py-5 sm:pl-35">
          {/* Avatar skeleton */}
          <div className="absolute -top-9.5 left-3 z-10 h-28 w-28 rounded-full border-4 border-white bg-slate-200 animate-pulse shadow-md sm:left-5" />
          <div className="min-w-0 sm:flex-1 flex flex-col gap-y-2">
            <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
            <div className="h-3.5 w-24 rounded bg-slate-200 animate-pulse" />
            <div className="mt-1 flex gap-x-4">
              <div className="h-3.5 w-28 rounded bg-slate-200 animate-pulse" />
              <div className="h-3.5 w-24 rounded bg-slate-200 animate-pulse" />
            </div>
          </div>
          <div className="h-9 w-full sm:w-28 rounded-lg bg-slate-200 animate-pulse shrink-0" />
        </div>
      ) : (
        channel && (
          <div className="relative flex flex-col items-stretch gap-4 px-4 pb-5 pt-20 sm:flex-row sm:items-center sm:px-8 sm:py-5 sm:pl-35">
            <img
              src={channel.avatar}
              alt={`${channel.username} avatar`}
              className="absolute -top-9.5 left-3 z-10 h-28 w-28 rounded-full border-4 border-white object-cover shadow-md sm:left-5"
            />
            <div className="min-w-0 sm:flex-1">
              <h1 className="truncate text-xl font-bold text-slate-900">
                {channel.fullName}
              </h1>
              <p className="truncate text-sm text-slate-500">
                @{channel.username}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                <span>
                  <strong className="text-slate-900">
                    {formatCompactNumber(channel.subscribersCount)}
                  </strong>{" "}
                  subscribers
                </span>
                <span>
                  <strong className="text-slate-900">
                    {formatCompactNumber(channel.channelsSubscribedToCount)}
                  </strong>{" "}
                  subscribed
                </span>
              </div>
            </div>
            {user?._id === channel._id ? (
              <Link
                to="/edit-channel"
                className="w-full shrink-0 rounded-lg bg-[#8132e5] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#7026c8] active:bg-[#7026c8] sm:w-auto"
              >
                Edit channel
              </Link>
            ) : (
              <button
                type="button"
                disabled={subscriptionLoading}
                onClick={async () => {
                  setSubscriptionLoading(true);
                  try {
                    await channelService.toggleSubscription(channel._id);
                    setChannel((currentChannel) => ({
                      ...currentChannel,
                      isSubscribed: !currentChannel.isSubscribed,
                      subscribersCount:
                        currentChannel.subscribersCount +
                        (currentChannel.isSubscribed ? -1 : 1),
                    }));
                  } catch (error) {
                    toast.error(
                      error.message || "Failed to update subscription"
                    );
                  } finally {
                    setSubscriptionLoading(false);
                  }
                }}
                className="w-full shrink-0 rounded-lg bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {subscriptionLoading
                  ? "Updating..."
                  : channel.isSubscribed
                    ? "Unsubscribe"
                    : "Subscribe"}
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default ChannelInformation;
