import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  RiHeartLine,
  RiHeartFill,
  RiMore2Fill,
  RiPencilLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { formatTimeAgo } from "../utils/formatTimeAgo";
import { formatCompactNumber } from "../utils/formatCompactNumber";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import { likeService } from "../services/likeService";
import { commentService } from "../services/commentService";
import { toast } from "react-hot-toast";

function CommentCard({ comment, onUpdate, onDelete }) {
  const { user } = useAuthContext();
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // The comment owner is populated as commentOwner based on the backend
  const owner = comment.commentOwner;
  const isCommentOwner = user?._id === owner?._id;

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLike = async () => {
    if (!user) return toast.error("Please login to like comments");

    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await likeService.toggleCommentLike(comment._id);
    } catch (err) {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      toast.error(err.message || "Failed to toggle like");
    }
  };

  const handleDelete = () => {
    setMenuOpen(false);
    if (onDelete) onDelete(comment._id);
  };

  const handleEdit = () => {
    setMenuOpen(false);
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editContent.trim() || editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await commentService.updateComment(
        comment._id,
        editContent.trim()
      );
      setIsEditing(false);
      if (onUpdate) onUpdate(comment._id, res.data.content);
      toast.success("Comment updated");
    } catch (err) {
      toast.error(err.message || "Failed to update comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-start gap-4 py-4 border-b border-b-gray-200 group">
      {/* Avatar */}
      <Link
        to={`/channel/${owner?.username}`}
        className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-slate-200"
      >
        <img
          src={owner?.avatar}
          alt={owner?.username}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-y-1.5 flex-1 min-w-0 relative">
        {/* Username & Time */}
        <div className="flex items-baseline gap-2">
          <Link
            to={`/channel/${owner?.username}`}
            className="text-sm font-semibold text-gray-900 hover:text-gray-700 leading-tight"
          >
            @{owner?.username}
          </Link>
          <span className="text-xs text-gray-500">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>

        {/* Three Dotted Menu (Owner Only) - Absolutely Positioned */}
        {isCommentOwner && (
          <div ref={menuRef} className="absolute right-0 -top-1">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition cursor-pointer opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
              aria-label="Comment options"
            >
              <RiMore2Fill className="text-lg" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-50 w-32 rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-200/60 overflow-hidden">
                <button
                  onClick={handleEdit}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  <RiPencilLine className="text-base text-gray-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <RiDeleteBinLine className="text-base shrink-0" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Comment Text / Edit Form */}
        {isEditing ? (
          <form
            onSubmit={handleSaveEdit}
            className="mt-2 flex flex-col gap-2 pr-8"
          >
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 py-1 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1 bg-[#8132e5] text-white text-xs font-medium rounded-full hover:bg-[#6e28c8] disabled:opacity-50 transition cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-tight mt-0.5 pr-8">
            {comment.content}
          </p>
        )}

        {/* Action Bottom Row (Likes) */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition cursor-pointer"
          >
            {isLiked ? (
              <RiHeartFill className="text-[17px] text-[#8132e5]" />
            ) : (
              <RiHeartLine className="text-[17px]" />
            )}
            <span className={isLiked ? "text-[#8132e5]" : ""}>
              {likesCount > 0 ? formatCompactNumber(likesCount) : ""}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
