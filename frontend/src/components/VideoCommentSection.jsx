import { useState, useEffect } from "react";
import { commentService } from "../services/commentService";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import { toast } from "react-hot-toast";
import { RiSendPlaneFill } from "react-icons/ri";

import CommentCard from "./CommentCard";
import CommentSkeleton from "./CommentSkeleton";

function VideoCommentSection({ videoId }) {
  const { user } = useAuthContext();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await commentService.getVideoComments(videoId, {
          page: 1,
          limit: 10,
        });
        // Assumes pagination result shape: res.data.docs or just res.data
        setComments(res.data?.docs || res.data || []);
      } catch (err) {
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await commentService.addComment(videoId, newComment.trim());

      const newCommentData = {
        ...res.data,
        commentOwner: {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
        },
        likesCount: 0,
        isLiked: false,
      };

      setComments((prev) => [newCommentData, ...prev]);
      setNewComment("");
      toast.success("Comment added");
    } catch (err) {
      toast.error(err.message || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    // Optimistic remove
    const prevComments = [...comments];
    setComments((prev) => prev.filter((c) => c._id !== commentId));

    try {
      await commentService.deleteComment(commentId);
      toast.success("Comment deleted");
    } catch (err) {
      setComments(prevComments);
      toast.error(err.message || "Failed to delete comment");
    }
  };

  const handleUpdateComment = (commentId, newContent) => {
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, content: newContent } : c))
    );
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      <h2 className="text-lg font-bold text-gray-900">
        {comments.length} Comments
      </h2>

      {/* Add Comment Input */}
      <div className="flex gap-4 items-start">
        <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-slate-100 border border-gray-200">
          {user ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-300" />
          )}
        </div>

        <form
          onSubmit={handleAddComment}
          className="flex-1 flex flex-col gap-2"
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-gray-300 py-1 text-sm text-gray-900 focus:outline-none focus:border-[#8132e5] transition-colors"
          />
          {newComment.trim() && (
            <div className="flex justify-end gap-2 mt-1">
              <button
                type="button"
                onClick={() => setNewComment("")}
                className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-[#8132e5] text-white text-sm font-medium rounded-full hover:bg-[#6e28c8] disabled:opacity-50 transition cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? "Posting..." : "Comment"}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-4 mt-2">
        {loading ? (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No comments yet. Be the first!
          </p>
        )}
      </div>
    </div>
  );
}

export default VideoCommentSection;
