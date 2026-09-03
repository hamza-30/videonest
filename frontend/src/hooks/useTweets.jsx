import { useState, useCallback } from "react";
import { tweetService } from "../services/tweetService";
import { toast } from "react-hot-toast";

function useTweets(userId) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserTweets = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await tweetService.getUserTweets(userId);
      setTweets(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch tweets");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addTweet = async (content) => {
    try {
      const response = await tweetService.createTweet({ content });
      setTweets((prev) => [response.data, ...prev]);
      toast.success("Tweet posted!");
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to post tweet");
      return false;
    }
  };

  const updateTweet = async (tweetId, content) => {
    try {
      const response = await tweetService.updateTweet(tweetId, { content });
      setTweets((prev) =>
        prev.map((t) => (t._id === tweetId ? response.data : t))
      );
      toast.success("Tweet updated");
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to update tweet");
      return false;
    }
  };

  const deleteTweet = async (tweetId) => {
    try {
      await tweetService.deleteTweet(tweetId);
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
      toast.success("Tweet deleted!");
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to delete tweet");
      return false;
    }
  };

  return {
    getUserTweets,
    addTweet,
    updateTweet,
    deleteTweet,
    tweets,
    loading,
    error,
  };
}

export default useTweets;
