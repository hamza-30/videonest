import TweetBox from "./TweetBox";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import useTweets from "../hooks/useTweets";
import { useEffect } from "react";
import TweetCard from "./TweetCard";
import TweetCardSkeleton from "./TweetCardSkeleton";

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
        Array.from({ length: 3 }).map((_, i) => (
          <TweetCardSkeleton key={i} />
        ))}

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
