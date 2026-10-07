import { useState, useEffect, useCallback, useRef } from "react";
import { notificationService } from "../services/notificationService";
import { useAuthContext } from "../context/auth/AuthContextProvider";

function useNotifications() {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);

  // Track whether the full list has been fetched at least once
  const hasFetched = useRef(false);
  const isFetchingMoreRef = useRef(false);

  // --- Unread count: fetch on mount ---
  useEffect(() => {
    if (!user) return;

    notificationService
      .getUnreadCount()
      .then((res) => setUnreadCount(res.data.count))
      .catch(() => {});
  }, [user]);

  // --- SSE: open connection on mount, close on unmount ---
  useEffect(() => {
    if (!user) return;

    const es = notificationService.createEventSource();

    es.addEventListener("notification", (e) => {
      const notification = JSON.parse(e.data);
      // Prepend to list if already loaded, so dropdown stays fresh
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    es.onerror = () => es.close();

    return () => es.close();
  }, [user]);

  // --- Full list: fetch on first dropdown open ---
  const fetchNotifications = useCallback(async () => {
    if (hasFetched.current) return;

    setLoading(true);
    try {
      const res = await notificationService.getNotifications(1);
      setNotifications(res.data.docs);
      setHasNextPage(res.data.hasNextPage);
      setPage(1);
      hasFetched.current = true;
    } catch (err) {
      // silently fail — dropdown will be empty
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Load more (pagination) ---
  const fetchMore = useCallback(async () => {
    if (!hasNextPage || isFetchingMoreRef.current) return;

    isFetchingMoreRef.current = true;
    setLoading(true);
    const nextPage = page + 1;
    try {
      const res = await notificationService.getNotifications(nextPage);
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n._id));
        const newDocs = res.data.docs.filter((n) => !existingIds.has(n._id));
        return [...prev, ...newDocs];
      });
      setHasNextPage(res.data.hasNextPage);
      setPage(nextPage);
    } catch (err) {
      // silently fail
    } finally {
      setLoading(false);
      isFetchingMoreRef.current = false;
    }
  }, [hasNextPage, page]);

  // --- Mark as read: call with the _id of the topmost notification ---
  const markAsRead = useCallback(
    async (upToId) => {
      if (!upToId || unreadCount === 0) return;

      try {
        await notificationService.markAsRead(upToId);
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (err) {
        // silently fail
      }
    },
    [unreadCount]
  );

  return {
    notifications,
    unreadCount,
    loading,
    hasNextPage,
    fetchNotifications,
    fetchMore,
    markAsRead,
  };
}

export default useNotifications;
