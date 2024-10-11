import { useState, useEffect } from "react";
import { BsCheckCircle, BsTrash } from "react-icons/bs";

const Notifications = ({ isOpen }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const response = await fetch("/api/notificationOption");
    if (response.ok) {
      const data = await response.json();
      setNotifications(data.notifications);
      console.log(data.notifications);
    }
  };

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
    <div className="absolute top-[3vh] mt-2 w-80 h-[50vh] bg-[#e2eefe] rounded-md shadow-lg overflow-hidden z-20">
      <div className="sticky top-0 bg-[#e2eefe] px-4 py-3 flex items-center justify-between">
        <h3 className="text-lg text-[#0b6ec9] font-semibold">Notifications</h3>
        <span className="text-sm text-gray-600">
          {notifications?.filter((n) => !n.isRead).length || 0} unread
        </span>
      </div>
      <div className="max-h-[calc(80vh-60px)] overflow-y-auto">
        {!notifications ? (
          <p className="px-4 py-8 text-center text-gray-500">
            Loading notifications...
          </p>
        ) : notifications.length === 0 ? (
          <p className="px-4 py-8 text-center text-gray-500">
            No notifications
          </p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.notification_id}
              className={`px-4 py-3 border-b last:border-b-0 ${
                notification.isRead
                  ? "bg-[#e2eefe]"
                  : "bg-blue-50 hover:bg-blue-100"
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
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
