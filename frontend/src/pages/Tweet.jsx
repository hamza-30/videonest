import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { RiChatOffLine } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { tweetService } from "../services/tweetService";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import TweetCard from "../components/TweetCard";
import TweetCardSkeleton from "../components/TweetCardSkeleton";

function Tweet() {
  const { tweetId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tweetId) return;

    const fetchTweet = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await tweetService.getTweetById(tweetId);
        setTweet(response.data);
      } catch (err) {
        setError(err.message || "Failed to load tweet");
      } finally {
        setLoading(false);
      }
    };

    fetchTweet();
  }, [tweetId]);

  const isOwner = Boolean(
    user?._id &&
    tweet?.owner?._id &&
    String(user._id) === String(tweet.owner._id)
  );

  const handleEditTweet = async (id, content) => {
    try {
      const response = await tweetService.updateTweet(id, { content });
      setTweet((prev) => ({
        ...prev,
        content: response.data.content,
      }));
      toast.success("Tweet updated");
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to update tweet");
      return false;
    }
  };

  const handleDeleteTweet = async (id) => {
    try {
      await tweetService.deleteTweet(id);
      toast.success("Tweet deleted");
      navigate(-1);
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to delete tweet");
      return false;
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6">
      {/* Header with back button */}
      <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          aria-label="Go back"
        >
          <FiArrowLeft className="text-[18px]" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Tweet</h1>
      </div>

      {/* Loading state */}
      {loading && <TweetCardSkeleton />}

      {/* Error state */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8132e5]/10">
            <RiChatOffLine className="h-8 w-8 text-[#8132e5]" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800">
              Tweet not found
            </p>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full bg-[#8132e5] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#7026c8] cursor-pointer"
          >
            Go Home
          </button>
        </div>
      )}

      {/* Tweet Card */}
      {!loading && !error && tweet && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <TweetCard
            tweet={tweet}
            isOwner={isOwner}
            channel={tweet.owner}
            editTweet={handleEditTweet}
            deleteTweet={handleDeleteTweet}
            className="border-none"
          />
        </div>
      )}
    </div>
  );
}
export default Tweet;
