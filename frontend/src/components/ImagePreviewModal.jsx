import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { LuImageUp } from "react-icons/lu";

function ImagePreviewModal({
  isOpen,
  type,
  previewUrl,
  onConfirm,
  onCancel,
  loading = false,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  const isAvatar = type === "avatar";

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-gray-950/35 px-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl shadow-gray-900/15"
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-preview-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1edfc] text-[#8132e5]">
            <LuImageUp className="text-xl" aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none"
            aria-label="Close dialog"
            title="Close"
          >
            <FiX className="text-lg" aria-hidden="true" />
          </button>
        </div>

        {/* Title */}
        <div className="mt-5">
          <h2
            id="image-preview-modal-title"
            className="text-lg font-semibold text-gray-900"
          >
            {isAvatar ? "Update profile photo?" : "Update cover image?"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Preview your new image below. Click "Upload" to apply it.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-4 flex justify-center">
          {isAvatar ? (
            <img
              src={previewUrl}
              alt="Avatar preview"
              className="h-32 w-32 rounded-full border-4 border-slate-100 object-cover shadow-sm"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Cover image preview"
              className="h-36 w-full rounded-xl object-cover"
            />
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-10 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#8132e5] px-4 text-sm font-medium text-white transition-colors hover:bg-[#7024cf] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Uploading...
              </>
            ) : (
              <>
                <LuImageUp aria-hidden="true" />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImagePreviewModal;
