import { useState, useEffect, useRef } from "react";
import { RiCloseLine } from "react-icons/ri";
import { LuImagePlus, LuUpload } from "react-icons/lu";
import { videoService } from "../services/videoService";
import { toast } from "react-hot-toast";

function EditVideoModal({ isOpen, onClose, video, onVideoUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  // Sync form state whenever modal opens or video changes
  useEffect(() => {
    if (isOpen && video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setThumbnailFile(null);
      setThumbnailPreview(video.thumbnail || null);
    }
  }, [isOpen, video]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, saving, onClose]);

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  if (!isOpen || !video) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setThumbnailFile(file);
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
  };

  const isTitleChanged = title.trim() !== (video.title || "").trim();
  const isDescriptionChanged =
    description.trim() !== (video.description || "").trim();
  const hasNewThumbnail = thumbnailFile !== null;
  const hasChanges = isTitleChanged || isDescriptionChanged || hasNewThumbnail;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) {
      onClose();
      return;
    }

    if (!title.trim()) {
      toast.error("Video title is required");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const response = await videoService.updateVideo(video._id, formData);
      const updatedVideo = response.data;

      if (onVideoUpdated) {
        onVideoUpdated(video._id, updatedVideo);
      }

      toast.success("Video updated successfully");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update video");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-gray-950/40 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/15 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-video-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2
            id="edit-video-modal-title"
            className="text-lg font-semibold text-slate-900"
          >
            Edit Video Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer disabled:pointer-events-none"
            aria-label="Close modal"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* Form Body - 2 columns on desktop */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 sm:p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Left Column: Thumbnail */}
            <div className="flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Thumbnail
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-[#8132e5] hover:bg-gray-100/70"
              >
                {thumbnailPreview ? (
                  <>
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 sm:bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex items-center gap-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white shadow-sm">
                        <LuUpload className="text-sm" />
                        <span>Change thumbnail</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                    <LuImagePlus className="text-3xl text-slate-400 group-hover:text-[#8132e5] transition-colors" />
                    <span className="text-xs font-medium group-hover:text-[#8132e5] transition-colors">
                      Click to select thumbnail
                    </span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={saving}
              />
              <p className="mt-2 text-[11px] text-slate-400">
                Click thumbnail to change image (JPG, PNG, WebP)
              </p>
            </div>

            {/* Right Column: Title & Description */}
            <div className="flex flex-col space-y-4">
              {/* Title input */}
              <div>
                <label
                  htmlFor="edit-video-title"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-video-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a title for your video"
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#8132e5] focus:ring-2 focus:ring-[#8132e5]/20 disabled:opacity-60"
                />
              </div>

              {/* Description input */}
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="edit-video-description"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="edit-video-description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell viewers about your video"
                  disabled={saving}
                  className="w-full flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#8132e5] focus:ring-2 focus:ring-[#8132e5]/20 disabled:opacity-60"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || !hasChanges}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8132e5] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7026c8] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditVideoModal;
