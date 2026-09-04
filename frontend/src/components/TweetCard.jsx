import { useState, useRef, useEffect } from "react";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { formatCompactNumber } from "../utils/formatCompactNumber";
import {
  RiHeartLine,
  RiHeartFill,
  RiMoreFill,
  RiEditLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import DeleteModal from "./DeleteModal";
import EmojiPicker from "./EmojiPicker";

function TweetCard({ tweet, isOwner, channel, editTweet, deleteTweet }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Inline edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet?.content || "");
  const [isSaving, setIsSaving] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const editTextareaRef = useRef(null);

  const authorName = channel?.fullName;
  const authorAvatar = channel?.avatar;

  const likesCount = tweet?.likesCount ?? 0;
  const isLiked = Boolean(tweet?.isLiked);

  // Focus and auto-resize textarea when entering edit mode
  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.style.height = "auto";
      editTextareaRef.current.style.height = `${Math.max(
        editTextareaRef.current.scrollHeight,
        52
      )}px`;
    }
  }, [isEditing]);

  // Sync editContent when tweet prop updates
  useEffect(() => {
    setEditContent(tweet?.content || "");
  }, [tweet?.content]);

  // Close menu on click outside or escape key
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMenu]);

  // Insert emoji at cursor position in edit mode
  const handleEditEmojiSelect = (emoji) => {
    const textarea = editTextareaRef.current;
    if (!textarea) {
      setEditContent((prev) => prev + emoji);
      return;
    }

    const start = textarea.selectionStart ?? editContent.length;
    const end = textarea.selectionEnd ?? editContent.length;
    const updated =
      editContent.slice(0, start) + emoji + editContent.slice(end);

    setEditContent(updated);

    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = start + emoji.length;
      textarea.setSelectionRange(newPos, newPos);
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(textarea.scrollHeight, 52)}px`;
    });
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || isSaving) return;
    if (!editTweet) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      const success = await editTweet(tweet._id, editContent);
      if (success) {
        setIsEditing(false);
      }
    } catch (err) {
      // toast already handled by hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTweet) {
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      setIsDeleting(true);
      await deleteTweet(tweet._id);
      setIsDeleteModalOpen(false);
    } catch (err) {
      // toast already handled by hook
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-3 border-b border-gray-200 px-4 py-3 transition-colors hover:bg-slate-50/60 sm:px-8">
      {/* Left: Author Avatar */}
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#8132e5]/10">
        <img
          src={authorAvatar}
          alt={authorName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Center: Tweet Details */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header: Name + Timestamp */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold text-slate-800 transition-colors hover:text-[#8132e5]">
            {authorName}
          </span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-slate-400">
            {formatTimeAgo(tweet?.createdAt)}
          </span>
        </div>

        {/* Content or Inline Edit Box */}
        {isEditing ? (
          <div className="mt-1.5 flex flex-col gap-2">
            <textarea
              ref={editTextareaRef}
              value={editContent}
              onChange={(e) => {
                setEditContent(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.max(
                  e.target.scrollHeight,
                  52
                )}px`;
              }}
              className="w-full resize-none rounded-xl border border-gray-200 bg-slate-50/60 p-2.5 text-[14.5px] leading-snug text-slate-800 outline-none transition focus:border-[#8132e5] focus:bg-white focus:ring-1 focus:ring-[#8132e5]"
              rows={2}
            />

            <div className="flex items-center justify-between pt-0.5">
              {/* Emoji Picker */}
              <EmojiPicker
                onSelectEmoji={handleEditEmojiSelect}
                align="left"
                placement="top"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditContent(tweet?.content || "");
                    setIsEditing(false);
                  }}
                  disabled={isSaving}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim() || isSaving}
                  className="rounded-full bg-[#8132e5] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#7026c8] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Tweet Content */}
            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-[14.5px] leading-snug text-slate-700">
              {tweet?.content}
            </p>

            {/* Bottom Bar: Like Button */}
            <div className="mt-1.5 flex items-center">
              <button
                type="button"
                className="group -ml-1.5 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs text-slate-500 transition-colors hover:text-[#8132e5] cursor-pointer"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full transition-colors group-hover:bg-[#8132e5]/10">
                  {isLiked ? (
                    <RiHeartFill className="h-3.5 w-3.5 text-[#8132e5]" />
                  ) : (
                    <RiHeartLine className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-[#8132e5]" />
                  )}
                </div>
                <span
                  className={`font-medium transition-colors ${
                    isLiked
                      ? "text-[#8132e5]"
                      : "text-slate-500 group-hover:text-[#8132e5]"
                  }`}
                >
                  {formatCompactNumber(likesCount)}
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right: Three Dotted Options Menu (visible to owner when not editing) */}
      {isOwner && !isEditing && (
        <div className="relative shrink-0">
          <button
            ref={buttonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-[#8132e5]/10 hover:text-[#8132e5] cursor-pointer"
            aria-label="Tweet options"
            aria-expanded={showMenu}
          >
            <RiMoreFill className="h-5 w-5" />
          </button>

          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-9 top-4.5 mt-1 z-30 w-30 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg shadow-slate-200/50"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  setEditContent(tweet?.content || "");
                  setIsEditing(true);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#8132e5] cursor-pointer"
              >
                <RiEditLine className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  setIsDeleteModalOpen(true);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
              >
                <RiDeleteBinLine className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete tweet?"
        description="Are you sure you want to delete this tweet? This action cannot be undone."
      />
    </div>
  );
}

export default TweetCard;
