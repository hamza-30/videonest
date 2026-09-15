import { useEffect, useState } from "react";
import { RiCloseLine, RiAddLine, RiCheckLine } from "react-icons/ri";
import { playlistService } from "../services/playlistService";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import toast from "react-hot-toast";

function SaveToPlaylistModal({ videoId, isOpen, onClose }) {
  const { user } = useAuthContext();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creating, setCreating] = useState(false);

  // Fetch user's playlists when modal opens
  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchPlaylists = async () => {
      setLoading(true);
      try {
        const res = await playlistService.getUserPlaylists(user._id);
        setPlaylists(res.data || []);
      } catch (err) {
        toast.error("Failed to load playlists");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
    // Reset create form when modal reopens
    setShowCreateForm(false);
    setNewPlaylistName("");
  }, [isOpen, user]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggle = async (playlist) => {
    const isInPlaylist = playlist.videoIds?.includes(videoId);
    const previousPlaylists = [...playlists];

    // Optimistic update
    setPlaylists((prev) =>
      prev.map((p) =>
        p._id === playlist._id
          ? {
              ...p,
              videoIds: isInPlaylist
                ? p.videoIds.filter((id) => id !== videoId)
                : [...(p.videoIds || []), videoId],
              videoCount: isInPlaylist ? p.videoCount - 1 : p.videoCount + 1,
            }
          : p
      )
    );

    try {
      if (isInPlaylist) {
        await playlistService.removeVideoFromPlaylist(videoId, playlist._id);
        toast.success(`Removed from ${playlist.name}`);
      } else {
        await playlistService.addVideoToPlaylist(videoId, playlist._id);
        toast.success(`Added to ${playlist.name}`);
      }
    } catch (err) {
      // Revert on error
      setPlaylists(previousPlaylists);
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setCreating(true);
    try {
      // Create the playlist
      const res = await playlistService.createPlaylist({
        name: newPlaylistName.trim(),
      });
      const newPlaylist = res.data;

      // Add the video to the new playlist
      await playlistService.addVideoToPlaylist(videoId, newPlaylist._id);

      // Add to local state with video already included
      setPlaylists((prev) => [
        ...prev,
        {
          ...newPlaylist,
          videoIds: [videoId],
          videoCount: 1,
        },
      ]);

      toast.success(`Created "${newPlaylistName.trim()}" and added video`);
      setNewPlaylistName("");
      setShowCreateForm(false);
    } catch (err) {
      toast.error(err.message || "Failed to create playlist");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-gray-950/35 px-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/15"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Save to playlist
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition"
            aria-label="Close"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* Playlist list */}
        <div className="max-h-64 overflow-y-auto px-2 py-2">
          {loading ? (
            // Skeleton
            <div className="flex flex-col gap-2 animate-pulse px-3 py-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="h-5 w-5 rounded bg-gray-200" />
                  <div className="h-4 w-36 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : playlists.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-gray-500">
              No playlists yet. Create one below!
            </p>
          ) : (
            playlists.map((playlist) => {
              const isChecked = playlist.videoIds?.includes(videoId);
              return (
                <label
                  key={playlist._id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 cursor-pointer transition select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(playlist)}
                    className="h-4.5 w-4.5 rounded border-gray-300 text-[#8132e5] accent-[#8132e5] cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {playlist.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {playlist.videoCount}{" "}
                      {playlist.videoCount === 1 ? "video" : "videos"}
                    </p>
                  </div>
                </label>
              );
            })
          )}
        </div>

        {/* Create new playlist */}
        <div className="border-t border-gray-100 px-5 py-3">
          {showCreateForm ? (
            <form
              onSubmit={handleCreatePlaylist}
              className="flex flex-col gap-2"
            >
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name"
                autoFocus
                disabled={creating}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#8132e5] focus:ring-2 focus:ring-[#8132e5]/20 disabled:opacity-60 transition"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={creating || !newPlaylistName.trim()}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-[#8132e5] px-4 text-xs font-medium text-white hover:bg-[#6e28c8] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
                >
                  {creating ? (
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <RiCheckLine />
                  )}
                  {creating ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPlaylistName("");
                  }}
                  disabled={creating}
                  className="flex h-8 items-center rounded-lg border border-gray-200 px-4 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 cursor-pointer transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex w-full items-center gap-2 rounded-lg py-2 text-sm font-medium text-[#8132e5] hover:text-[#6e28c8] cursor-pointer transition"
            >
              <RiAddLine className="text-lg" />
              Create new playlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SaveToPlaylistModal;
