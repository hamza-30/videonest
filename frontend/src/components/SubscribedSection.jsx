import { useEffect, useState, useMemo } from "react";
import useSubscribedChannels from "../hooks/useSubscribedChannels";
import SubscribedChannelCard from "./SubscribedChannelCard";
import SubscribedChannelCardSkeleton from "./SubscribedChannelCardSkeleton";
import {
  RiUserFollowLine,
  RiUserSearchLine,
  RiSearchLine,
  RiCloseLine,
} from "react-icons/ri";

function SubscribedSection({ subscriberId }) {
  const { getSubscribedChannels, subscribedChannels, loading, error } =
    useSubscribedChannels(subscriberId);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredChannels = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return subscribedChannels;

    return subscribedChannels.filter(
      (channel) =>
        channel.fullName?.toLowerCase().includes(query) ||
        channel.username?.toLowerCase().includes(query)
    );
  }, [subscribedChannels, searchQuery]);

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
    <>
      <div className="px-4 sm:px-8">
        <div className="relative mt-4 w-full">
          <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-9 text-[15px] outline-none border border-gray-200 rounded-lg focus:border-transparent focus:ring focus:ring-[#8132e5] transition-all ease-in-out duration-100"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <RiCloseLine className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid w-full min-w-0 grid-cols-1 gap-3 px-4 py-6 sm:grid-cols-2 sm:px-8 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <SubscribedChannelCardSkeleton key={i} />
          ))
        ) : filteredChannels.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center gap-2.5 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8132e5]/10">
              <RiUserSearchLine className="h-7 w-7 text-[#8132e5]" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800">
                No channels found
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                No results found for &ldquo;{searchQuery.trim()}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-2.5 inline-flex items-center text-xs font-semibold text-[#8132e5] hover:underline cursor-pointer"
              >
                Clear search
              </button>
            </div>
          </div>
        ) : (
          filteredChannels.map((channel) => (
            <SubscribedChannelCard key={channel._id} channel={channel} />
          ))
        )}
      </div>
    </>
  );
}

export default SubscribedSection;
