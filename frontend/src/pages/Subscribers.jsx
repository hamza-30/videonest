import { useState, useEffect } from "react";
import { subscriptionService } from "../services/subscriptionService";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import SubscriberChannelCard from "../components/SubscriberChannelCard";
import SubscriberChannelCardSkeleton from "../components/SubscriberChannelCardSkeleton";
import { toast } from "react-hot-toast";

function Subscribers() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const getUserSubscribedChannel = async () => {
      setLoading(true);
      try {
        const response = await subscriptionService.getUserChannelSubscribers(
          user._id
        );
        setSubscribers(response.data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch subscribers");
      } finally {
        setLoading(false);
      }
    };

    getUserSubscribedChannel();
  }, [user._id]);

  return (
    <div className="p-4 sm:p-6 w-full">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Subscribers</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <SubscriberChannelCardSkeleton key={i} />
          ))}
        </div>
      ) : subscribers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subscribers.map((sub) => (
            <SubscriberChannelCard key={sub._id} channel={sub} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-slate-900">
            No subscribers yet
          </p>
          <p className="text-sm text-slate-500 mt-2">
            When people subscribe to your channel, they'll appear here
          </p>
        </div>
      )}
    </div>
  );
}

export default Subscribers;
