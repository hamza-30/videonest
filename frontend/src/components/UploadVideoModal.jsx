import { useState, useEffect, useRef, useCallback } from "react";
import { RiCloseLine } from "react-icons/ri";
import {
  LuUpload,
  LuVideo,
  LuImagePlus,
  LuFileVideo,
  LuX,
} from "react-icons/lu";
import { videoService } from "../services/videoService";
import { toast } from "react-hot-toast";

function UploadVideoModal({ isOpen, onClose, onVideoUploaded }) {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const resetForm = useCallback(() => {
    setVideoFile(null);
    setThumbnailFile(null);
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailPreview(null);
    setTitle("");
    setDescription("");
    setUploading(false);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  }, [thumbnailPreview]);

  const handleClose = useCallback(() => {
    if (uploading) return;
    resetForm();
    onClose();
  }, [uploading, resetForm, onClose]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !uploading) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, uploading, handleClose]);

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  if (!isOpen) return null;

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file (MP4, MKV, WebM, etc.)");
      return;
    }

    setVideoFile(file);

    // Auto-fill title from filename if title is currently empty
    if (!title.trim()) {
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTitle(fileNameWithoutExt);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WebP)");
      return;
    }

    setThumbnailFile(file);
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
  };

  const handleRemoveVideo = (e) => {
    e.stopPropagation();
    setVideoFile(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleRemoveThumbnail = (e) => {
    e.stopPropagation();
    setThumbnailFile(null);
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error("Please select a video file to upload");
      return;
    }

    if (!thumbnailFile) {
      toast.error("Please select a thumbnail image");
      return;
    }

    if (!title.trim()) {
      toast.error("Video title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Video description is required");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("videoFile", videoFile);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("thumbnail", thumbnailFile);

      const response = await videoService.uploadVideo(formData);
      const newVideo = response.data;

      if (onVideoUploaded) {
        onVideoUploaded(newVideo);
      }

      toast.success("Video uploaded successfully!");
      resetForm();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const isSubmitDisabled =
    uploading ||
    !videoFile ||
    !thumbnailFile ||
    !title.trim() ||
    !description.trim();

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-gray-950/40 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !uploading) handleClose();
      }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/15 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-video-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8132e5]/10 text-[#8132e5]">
              <LuVideo className="text-lg" />
            </div>
            <h2
              id="upload-video-modal-title"
              className="text-lg font-semibold text-slate-900"
            >
              Upload Video
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
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
            {/* Left Column: Video File & Thumbnail */}
            <div className="flex flex-col space-y-4">
              {/* Video File Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Video File <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => !uploading && videoInputRef.current?.click()}
                  className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-colors cursor-pointer ${
                    videoFile
                      ? "border-emerald-300 bg-emerald-50/40"
                      : "border-gray-300 bg-gray-50 hover:border-[#8132e5] hover:bg-gray-100/70"
                  }`}
                >
                  {videoFile ? (
                    <div className="flex w-full items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                          <LuFileVideo className="text-xl" />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="truncate text-xs font-medium text-slate-800">
                            {videoFile.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {formatFileSize(videoFile.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        disabled={uploading}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Remove video"
                      >
                        <LuX className="text-base" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-2 text-slate-400">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[#8132e5] mb-2 group-hover:bg-[#8132e5]/10 transition-colors">
                        <LuUpload className="text-lg" />
                      </div>
                      <p className="text-xs font-medium text-slate-700 group-hover:text-[#8132e5] transition-colors">
                        Select video file
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        MP4, WebM, MKV
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoChange}
                  disabled={uploading}
                />
              </div>

              {/* Thumbnail Picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Thumbnail <span className="text-red-500">*</span>
                  </label>
                  {thumbnailFile && (
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      disabled={uploading}
                      className="text-[11px] text-red-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div
                  onClick={() => !uploading && thumbnailInputRef.current?.click()}
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
                      <LuImagePlus className="text-2xl text-slate-400 group-hover:text-[#8132e5] transition-colors" />
                      <span className="text-xs font-medium group-hover:text-[#8132e5] transition-colors">
                        Upload custom thumbnail
                      </span>
                    </div>
                  )}
                </div>

                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailChange}
                  disabled={uploading}
                />
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Accepted formats: JPG, PNG, WebP
                </p>
              </div>
            </div>

            {/* Right Column: Title & Description */}
            <div className="flex flex-col space-y-4">
              {/* Title input */}
              <div>
                <label
                  htmlFor="upload-video-title"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="upload-video-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a title that describes your video"
                  disabled={uploading}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#8132e5] focus:ring-2 focus:ring-[#8132e5]/20 disabled:opacity-60"
                />
              </div>

              {/* Description input */}
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="upload-video-description"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="upload-video-description"
                  required
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell viewers about your video"
                  disabled={uploading}
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
            onClick={handleClose}
            disabled={uploading}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8132e5] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7026c8] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {uploading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Upload Video</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadVideoModal;
