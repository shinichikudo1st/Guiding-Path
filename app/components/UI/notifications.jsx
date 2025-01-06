import { useState, useEffect, useCallback, useRef } from "react";
import { BsCheckCircle, BsTrash } from "react-icons/bs";
import { motion } from "framer-motion";

const Notifications = ({
  isOpen,
  unreadCount,
  onNotificationClick,
  onClose,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const notificationsEndRef = useRef(null);

  const fetchNotifications = useCallback(
    async (pageNum) => {
      if (pageNum === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      try {
        const response = await fetch(`/api/notificationOption?page=${pageNum}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications((prev) =>
            pageNum === 1
              ? data.notifications
              : [...prev, ...data.notifications]
          );
          setHasMore(data.hasMore);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      fetchNotifications(1);
    }
  }, [isOpen, fetchNotifications]);

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
      if (
        scrollHeight - scrollTop <= clientHeight * 1.5 &&
        hasMore &&
        !isFetchingMore
      ) {
        setPage((prev) => prev + 1);
        fetchNotifications(page + 1);
      }
    },
    [hasMore, isFetchingMore, fetchNotifications, page]
  );

  const markAsRead = async (id) => {
    try {
      const response = await fetch("/api/notificationOption", {
        method: "PUT",
        body: JSON.stringify({ notificationId: id }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Update local state immediately
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.notification_id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch("/api/notificationOption", {
        method: "DELETE",
        body: JSON.stringify({ notificationId: id }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Update local state immediately
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.notification_id !== id
          )
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.notification_id);

    switch (notification.title) {
      case "New Referral Request":
        onNotificationClick("referral");
        break;
      case "New Appointment Request":
        onNotificationClick("appointment");
        break;
      case "New Event":
        onNotificationClick("event");
        break;
      case "Appointment Request":
        onNotificationClick("appointment");
        break;
      case "Referred Appointment":
        onNotificationClick("appointment");
        break;
      case "New Announcement":
        onNotificationClick("announcement");
        break;
      case "New Resource Posted":
        onNotificationClick("resources");
        break;
      case "New Appraisal":
        onNotificationClick("appraisal");
        break;
      default:
        break;
    }
    // Close notifications after handling click
    onClose();
  };

  if (!isOpen) return null;

  const LoadingSkeleton = () => (
    <div className="animate-pulse p-4 space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-4 shadow-sm border border-[#0B6EC9]/5"
        >
          <div className="flex justify-between items-start">
            <div className="flex-grow pr-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-full"></div>
              <div className="h-2 bg-gray-50 rounded w-1/4 mt-2"></div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-2 w-[90vw] sm:w-[400px] max-h-[80vh] bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden"
      style={{ top: "calc(100% + 0.5rem)" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] px-6 py-4 sticky top-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Notifications</h3>
          <span className="text-sm text-white/90 bg-white/10 px-3 py-1 rounded-full">
            {unreadCount || 0} unread
          </span>
        </div>
      </div>

      {/* Notifications List */}
      <div
        className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9]/60 scrollbar-track-gray-100"
        onScroll={handleScroll}
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : notifications.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-[#062341] font-medium">No notifications</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.notification_id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-xl p-4 shadow-sm border border-[#0B6EC9]/5 hover:shadow-md transition-all cursor-pointer ${
                  !notification.isRead ? "bg-[#0B6EC9]/5" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow pr-4">
                    <h4
                      className={`font-semibold ${
                        notification.isRead ? "text-gray-700" : "text-blue-600"
                      }`}
                    >
                      {notification.title}
                    </h4>
                    <p
                      className={`text-sm mt-1 ${
                        notification.isRead ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      {notification.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    {!notification.isRead && (
                      <button
                        className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100 transition-colors duration-200"
                        onClick={() => markAsRead(notification.notification_id)}
                        title="Mark as read"
                      >
                        <BsCheckCircle size={18} />
                      </button>
                    )}
                    <button
                      className="text-red-400 hover:text-red-500 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                      onClick={() =>
                        deleteNotification(notification.notification_id)
                      }
                      title="Delete notification"
                    >
                      <BsTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {isFetchingMore && <LoadingSkeleton />}
            <div ref={notificationsEndRef} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;
