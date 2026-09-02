import { useEffect } from "react";
import useSubscribedChannels from "../hooks/useSubscribedChannels";
import SubscribedChannelCard from "./SubscribedChannelCard";
import SubscribedChannelCardSkeleton from "./SubscribedChannelCardSkeleton";
import { RiUserFollowLine } from "react-icons/ri";

function SubscribedSection({ subscriberId }) {
  const { getSubscribedChannels, subscribedChannels, loading, error } =
    useSubscribedChannels(subscriberId);

  useEffect(() => {
    if (!subscriberId) return;
    const getChannels = async () => {
      await getSubscribedChannels();
    };

    getChannels();
  }, [subscriberId]);

  if (!loading && subscriberId && subscribedChannels?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#8132e5]/10">
          <RiUserFollowLine className="h-10 w-10 text-[#8132e5]" />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-800">
            No subscriptions yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            This channel hasn't subscribed to any channels yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-3 px-4 py-6 sm:grid-cols-2 sm:px-8 xl:grid-cols-3">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <SubscribedChannelCardSkeleton key={i} />
          ))
        : subscribedChannels?.map((channel) => (
            <SubscribedChannelCard key={channel._id} channel={channel} />
          ))}
    </div>
  );
}

export default SubscribedSection;
