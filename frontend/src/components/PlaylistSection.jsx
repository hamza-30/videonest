import { useEffect } from "react";
import usePlaylists from "../hooks/usePlaylists";
import PlayListCard from "./PlayListCard";
import { RiPlayListLine } from "react-icons/ri";

function PlaylistSection({ channelId }) {
  const { playlists, loading, getUserPlayLists } = usePlaylists(channelId);

  useEffect(() => {
    if (!channelId) return;
    getUserPlayLists();
  }, [channelId, getUserPlayLists]);

  if (!loading && channelId && playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#8132e5]/10">
          <RiPlayListLine className="h-10 w-10 text-[#8132e5]" />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-800">
            No playlists yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            This channel hasn't created any playlists yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 px-4 py-6 sm:grid-cols-2 sm:gap-3 sm:px-8 lg:grid-cols-3 xl:grid-cols-4">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex min-w-0 w-full flex-col gap-y-3 rounded-xl p-2"
            >
              <div className="aspect-video w-full rounded-2xl bg-slate-200 animate-pulse" />
              <div className="flex flex-col gap-y-2 px-1 pb-1">
                <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-slate-200 animate-pulse" />
                <div className="mt-1 h-3 w-1/4 rounded bg-slate-200 animate-pulse" />
              </div>
            </div>
          ))
        : playlists.map((playlist) => (
            <PlayListCard key={playlist._id} playlist={playlist} />
          ))}
    </div>
  );
}

export default PlaylistSection;
