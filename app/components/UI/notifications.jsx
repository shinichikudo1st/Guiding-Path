import { useState, useEffect, useCallback } from "react";
import { BsCheckCircle, BsTrash } from "react-icons/bs";
import { motion } from "framer-motion";

const Notifications = ({ isOpen, onNotificationChange }) => {
  const [notifications, setNotifications] = useState([]);

  // Demo-friendly polling interval
  const DEMO_POLLING_INTERVAL = 2000; // 2 seconds for snappy demo updates

  const fetchNotifications = useCallback(async () => {
    const response = await fetch("/api/notificationOption");
    if (response.ok) {
      const data = await response.json();
      setNotifications(data.notifications);
      onNotificationChange();
    }
  }, [onNotificationChange]);

  useEffect(() => {
    fetchNotifications(); // Initial fetch

    // Aggressive polling for demo purposes
    const interval = setInterval(fetchNotifications, DEMO_POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    const response = await fetch("/api/notificationOption", {
      method: "PUT",
      body: JSON.stringify({ notificationId: id }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      fetchNotifications();
    }
  };

  const deleteNotification = async (id) => {
    const response = await fetch("/api/notificationOption", {
      method: "DELETE",
      body: JSON.stringify({ notificationId: id }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      fetchNotifications();
    }
  };

  if (!isOpen) return null;

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
            {notifications?.filter((n) => !n.isRead).length || 0} unread
          </span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9]/60 scrollbar-track-gray-100">
        {!notifications ? (
          <div className="flex items-center justify-center h-32">
            <div className="px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-[#0B6EC9] to-[#095396] rounded-xl animate-pulse">
              Loading notifications...
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-[#062341] font-medium">No notifications</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {notifications.map((notification) => (
              <motion.div
                key={notification.notification_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl p-4 shadow-sm border ${
                  notification.isRead
                    ? "border-[#0B6EC9]/5"
                    : "border-[#0B6EC9]/20"
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;
