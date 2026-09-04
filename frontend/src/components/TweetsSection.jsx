import TweetBox from "./TweetBox";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import useTweets from "../hooks/useTweets";
import { useEffect } from "react";
import TweetCard from "./TweetCard";
import TweetCardSkeleton from "./TweetCardSkeleton";
import { RiChatOffLine } from "react-icons/ri";

function TweetsSection({ channel }) {
  const { user } = useAuthContext();
  const userId = channel?._id;
  const isOwner = Boolean(
    user?._id && userId && String(user._id) === String(userId)
  );
  const {
    getUserTweets,
    addTweet,
    updateTweet,
    deleteTweet,
    tweets,
    loading,
    error,
  } = useTweets(userId);

  useEffect(() => {
    if (!userId) return;
    const getTweets = async () => {
      await getUserTweets();
    };

    getTweets();
  }, [userId]);

  return (
    <>
      <div>{isOwner && <TweetBox user={user} addTweet={addTweet} />}</div>

      {loading &&
        Array.from({ length: 4 }).map((_, i) => <TweetCardSkeleton key={i} />)}

      {!loading && tweets.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8132e5]/10">
            <RiChatOffLine className="h-8 w-8 text-[#8132e5]" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800">
              {isOwner ? "No tweets yet" : "No tweets to show"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {isOwner
                ? "Share updates, questions, or announcements with your audience above."
                : `${channel?.fullName || "This channel"} hasn't posted any tweets yet. Check back later!`}
            </p>
          </div>
        </div>
      )}

      {!loading &&
        tweets.length > 0 &&
        tweets.map((t) => (
          <TweetCard
            key={t._id}
            tweet={t}
            isOwner={isOwner}
            channel={channel}
            editTweet={updateTweet}
            deleteTweet={deleteTweet}
          />
        ))}
    </>
  );
}

export default TweetsSection;
