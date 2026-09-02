import { useState } from "react";
import { subscriptionService } from "../services/subscriptionService";

function useSubscribedChannels(subscriberId) {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSubscribedChannels = async () => {
    setLoading(true);
    setError(false);
    try {
      const response =
        await subscriptionService.getSubscribedChannels(subscriberId);
      setSubscribedChannels(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch subscribed channels");
    } finally {
      setLoading(false);
    }
  };

  return { getSubscribedChannels, subscribedChannels, loading, error };
}

export default useSubscribedChannels;
