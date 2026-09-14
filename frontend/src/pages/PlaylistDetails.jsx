import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DeleteModal from "../components/DeleteModal";
import PlaylistVideoCard from "../components/PlaylistVideoCard";
import PlaylistDetailsSkeleton from "../components/PlaylistDetailsSkeleton";
import {
  RiMoreLine,
  RiPencilLine,
  RiDeleteBinLine,
  RiPlayListLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { playlistService } from "../services/playlistService";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../context/auth/AuthContextProvider";

const CLAMP_THRESHOLD = 150;

function Description({ text }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > CLAMP_THRESHOLD;

  return (
    <div className="text-sm text-gray-500 leading-relaxed">
      <p className={!expanded && isLong ? "line-clamp-3" : ""}>{text}</p>
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-xs font-medium text-[#8132e5] hover:underline cursor-pointer"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function PlaylistDetails() {
  const { user } = useAuthContext();
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // three-dot menu
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // inline edit
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);

  // close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const getPlaylist = async () => {
      setLoading(true);
      try {
        const response = await playlistService.getPlaylistById(playlistId);
        const data = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        setPlaylist(data);
        setVideos(data.videos);
      } catch (err) {
        toast.error(err.message || "Failed to load playlist");
      } finally {
        setLoading(false);
      }
    };

    getPlaylist();
  }, [playlistId]);

  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEditOpen = () => {
    setEditName(playlist.name);
    setEditDescription(playlist.description || "");
    setMenuOpen(false);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const res = await playlistService.updatePlaylist(playlistId, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      setPlaylist((prev) => ({
        ...prev,
        name: editName.trim(),
        description: editDescription.trim(),
      }));
      setIsEditing(false);
      toast.success("Playlist updated");
    } catch (err) {
      toast.error(err.message || "Failed to update playlist");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await playlistService.deletePlaylist(playlistId);
      toast.success("Playlist deleted");
      navigate(-1);
    } catch (err) {
      toast.error(err.message || "Failed to delete playlist");
      setDeleting(false);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    // Optimistic UI update
    const previousVideos = [...videos];
    setVideos((prev) => prev.filter((v) => v._id !== videoId));

    try {
      await playlistService.removeVideoFromPlaylist(videoId, playlistId);
      toast.success("Video removed from playlist");
    } catch (err) {
      setVideos(previousVideos);
      toast.error(err.message || "Failed to remove video");
    }
  };

  if (loading || !playlist) {
    return <PlaylistDetailsSkeleton />;
  }

  const isOwner = user?._id === playlist.owner._id;

  return (
    <div className={`p-4`}>
      {/* Header card */}
      <div className="bg-[#8032e516] rounded-2xl flex flex-col sm:flex-row sm:items-start gap-4 p-3 sm:p-4">
        {/* Thumbnail */}
        <div className="aspect-video w-full sm:w-72 md:w-80 shrink-0 rounded-xl overflow-hidden bg-slate-200">
          {videos[0]?.thumbnail ? (
            <img
              src={videos[0].thumbnail}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#8132e5]/10 to-[#8132e5]/5">
              <RiPlayListLine className="h-12 w-12 text-[#8132e5]/40" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 gap-3 min-w-0 py-1">
          {isEditing ? (
            /* ── Inline edit form ── */
            <div className="flex flex-col gap-2.5">
              {/* Name input */}
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Playlist name"
                disabled={saving}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-[#8132e5] focus:ring-2 focus:ring-[#8132e5]/20 disabled:opacity-60 transition"
              />
              {/* Description textarea */}
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
                disabled={saving}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-[#8132e5] focus:ring-2 focus:ring-[#8132e5]/20 resize-none disabled:opacity-60 transition"
              />
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !editName.trim()}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-[#8132e5] px-4 text-xs font-medium text-white hover:bg-[#6e28c8] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
                >
                  {saving ? (
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <RiCheckLine />
                  )}
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleEditCancel}
                  disabled={saving}
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 px-4 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 cursor-pointer transition"
                >
                  <RiCloseLine />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ── Display mode ── */
            <>
              {/* Playlist name + three-dot menu */}
              <div className="flex items-center justify-between gap-2">
                <p className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
                  {playlist.name}
                </p>

                {/* Three-dot menu (owner only) */}
                {isOwner && (
                  <div ref={menuRef} className="relative shrink-0">
                    <button
                      onClick={() => setMenuOpen((prev) => !prev)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-black/10 hover:text-gray-800 transition cursor-pointer"
                      aria-label="Playlist options"
                    >
                      <RiMoreLine className="text-xl" />
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-200/60">
                        <button
                          onClick={handleEditOpen}
                          className="flex w-full items-center rounded-t-[inherit] gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                        >
                          <RiPencilLine className="text-base text-gray-400" />
                          Edit details
                        </button>
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            setShowDeleteModal(true);
                          }}
                          className="flex w-full items-center rounded-b-[inherit] gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                          <RiDeleteBinLine className="text-base" />
                          Delete playlist
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {playlist.description && (
                <Description text={playlist.description} />
              )}
            </>
          )}

          {/* Owner */}
          <div className="flex items-center gap-3">
            <img
              src={playlist.owner.avatar}
              alt={playlist.owner.fullName}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover border border-gray-200 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {playlist.owner.fullName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                @{playlist.owner.username}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
            <span>
              {videos.length} {videos.length === 1 ? "video" : "videos"}
            </span>
            <span>•</span>
            <span>Updated {formatTimeAgo(playlist.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Videos List */}
      <div className="mt-6 flex flex-col gap-2">
        {videos.map((video) => (
          <PlaylistVideoCard
            key={video._id}
            video={video}
            isOwner={isOwner}
            onRemove={handleRemoveVideo}
          />
        ))}
        {videos.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No videos in this playlist yet.
          </div>
        )}
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete playlist?"
        description="Are you sure you want to delete this playlist? This action cannot be undone."
      />
    </div>
  );
}

export default PlaylistDetails;
