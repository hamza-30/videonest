import { useEffect, useRef } from "react";
import NotificationItem from "./NotificationItem";

function NotificationDropdown({
  notifications,
  loading,
  hasNextPage,
  onLoadMore,
  onClose,
}) {
  const sentinelRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // IntersectionObserver for load more
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!sentinel || !scrollContainer || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: scrollContainer,
        rootMargin: "50px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, onLoadMore]);

  return (
    <div className="fixed inset-x-3 top-17 z-50 mx-auto max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-200/60 sm:absolute sm:inset-x-auto sm:right-0 sm:top-11 sm:mx-0 sm:w-87.5 sm:max-w-none">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-[14px] font-semibold text-gray-800">
          Notifications
        </h3>
      </div>

      {/* Content */}
      <div
        ref={scrollContainerRef}
        className="max-h-[70vh] sm:max-h-105 overflow-y-auto"
      >
        {/* First load spinner */}
        {loading && notifications.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#8132e5] border-t-transparent" />
          </div>
        )}

        {/* Empty state */}
        {!loading && notifications.length === 0 && (
          <p className="py-10 text-center text-[13px] text-gray-400">
            No notifications yet
          </p>
        )}

        {/* List */}
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onClose={onClose}
          />
        ))}

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} className="h-4 w-full" />

        {/* Load more spinner */}
        {loading && notifications.length > 0 && (
          <div className="flex justify-center py-3">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#8132e5] border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;
