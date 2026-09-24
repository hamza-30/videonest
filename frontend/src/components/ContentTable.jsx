import { useState } from "react";
import { Link } from "react-router-dom";
import { LuPencil, LuTrash2, LuThumbsUp, LuFilm } from "react-icons/lu";
import { formatDuration } from "../utils/formatDuration";
import { formatCompactNumber } from "../utils/formatCompactNumber";
import DeleteModal from "./DeleteModal";
import EditVideoModal from "./EditVideoModal";
import { videoService } from "../services/videoService";
import { toast } from "react-hot-toast";

function ContentTable({
  videos = [],
  loading = false,
  onVideoDeleted,
  onVideoUpdated,
}) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [videoToEdit, setVideoToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = (video) => {
    setVideoToEdit(video);
    setIsEditModalOpen(true);
  };

  const handleTogglePublish = async (video) => {
    setTogglingId(video._id);
    try {
      await videoService.togglePublishStatus(video._id);
      if (onVideoUpdated) {
        onVideoUpdated(video._id, { isPublished: !video.isPublished });
      }
      toast.success(
        video.isPublished
          ? "Video set to private"
          : "Video published successfully"
      );
    } catch (error) {
      toast.error(error.message || "Failed to toggle publish status");
    } finally {
      setTogglingId(null);
    }
  };

  const openDeleteModal = (video) => {
    setSelectedVideo(video);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVideo) return;
    setDeleting(true);
    try {
      await videoService.deleteVideo(selectedVideo._id);
      if (onVideoDeleted) {
        onVideoDeleted(selectedVideo._id);
      }
      toast.success("Video deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedVideo(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete video");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <th scope="col" className="px-5 py-3.5 text-center w-24">
                  Visibility
                </th>
                <th scope="col" className="px-5 py-3.5 w-32">
                  Status
                </th>
                <th scope="col" className="px-5 py-3.5 min-w-70">
                  Title
                </th>
                <th scope="col" className="px-5 py-3.5 w-32">
                  Rating
                </th>
                <th scope="col" className="px-5 py-3.5 w-36 whitespace-nowrap">
                  Date uploaded
                </th>
                <th scope="col" className="px-5 py-3.5 text-right w-28">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                // Skeleton loading rows
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4 text-center">
                      <div className="h-6 w-11 bg-slate-200 rounded-full mx-auto" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-6 w-20 bg-slate-200 rounded-full" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-24 bg-slate-200 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 bg-slate-200 rounded" />
                          <div className="h-3 w-1/3 bg-slate-200 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-12 bg-slate-200 rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-20 bg-slate-200 rounded" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-8 bg-slate-200 rounded-lg" />
                        <div className="h-8 w-8 bg-slate-200 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : videos.length > 0 ? (
                videos.map((video) => (
                  <tr
                    key={video._id}
                    className="hover:bg-gray-50/75 transition-colors duration-150"
                  >
                    {/* 1. Visibility (Toggle Switch) */}
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={video.isPublished}
                        disabled={togglingId === video._id}
                        onClick={() => handleTogglePublish(video)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                          video.isPublished ? "bg-[#8132e5]" : "bg-gray-300"
                        }`}
                        title={
                          video.isPublished
                            ? "Click to make private"
                            : "Click to publish"
                        }
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            video.isPublished
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* 2. Status Badge */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          video.isPublished
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {video.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>

                    {/* 3. Title (Thumbnail + Title info) */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/watch/${video._id}`}
                          className="relative aspect-video w-24 sm:w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100 group"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
                            {formatDuration(video.duration)}
                          </span>
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/watch/${video._id}`}
                            className="font-medium text-slate-900 hover:text-[#8132e5] transition-colors line-clamp-1"
                            title={video.title}
                          >
                            {video.title}
                          </Link>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {formatCompactNumber(video.views)}{" "}
                            {video.views === 1 ? "view" : "views"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 4. Rating */}
                    <td className="px-5 py-4 text-slate-700">
                      <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                        <LuThumbsUp className="text-[#8132e5] text-base shrink-0" />
                        <span>
                          {formatCompactNumber(video.likesCount || 0)}
                        </span>
                      </div>
                    </td>

                    {/* 5. Date Uploaded */}
                    <td className="px-5 py-4 text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                      {new Date(video.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* 6. Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(video)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#8132e5] transition-colors cursor-pointer"
                          title="Edit video"
                          aria-label="Edit video"
                        >
                          <LuPencil className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(video)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete video"
                          aria-label="Delete video"
                        >
                          <LuTrash2 className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                        <LuFilm className="text-2xl" />
                      </div>
                      <p className="text-base font-medium text-slate-900">
                        No videos uploaded yet
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
                        Click the "Upload video" button above to upload your
                        first video to your channel.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete video?"
        description={`Are you sure you want to permanently delete "${selectedVideo?.title}"? This action cannot be undone.`}
      />

      <EditVideoModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setVideoToEdit(null);
        }}
        video={videoToEdit}
        onVideoUpdated={onVideoUpdated}
      />
    </>
  );
}

export default ContentTable;
