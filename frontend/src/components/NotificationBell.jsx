import { useState, useRef, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import useNotifications from "../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const {
    notifications,
    unreadCount,
    loading,
    hasNextPage,
    fetchNotifications,
    fetchMore,
    markAsRead,
  } = useNotifications();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && unreadCount > 0 && notifications.length > 0) {
      markAsRead(notifications[0]._id);
    }
  }, [isOpen, unreadCount, notifications, markAsRead]);

  const toggleDropdown = () => {
    if (!isOpen) {
      setIsOpen(true);
      fetchNotifications();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
        title="Notifications"
      >
        <IoNotificationsOutline className="text-[20px]" />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8132e5] px-1 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          loading={loading}
          hasNextPage={hasNextPage}
          onLoadMore={fetchMore}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default NotificationBell;
