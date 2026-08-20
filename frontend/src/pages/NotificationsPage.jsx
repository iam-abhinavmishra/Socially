import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const response = await api.get(
        `/notifications/user/${user.id}`
      );

      const data =
        response.data?.data || response.data;

      setNotifications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error.response?.data || error
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId) {
    try {
      await api.put(
        `/notifications/${notificationId}/read`
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                read: true,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error.response?.data || error
      );
    }
  }

  async function deleteNotification(notificationId) {
    try {
      await api.delete(
        `/notifications/${notificationId}`
      );

      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (notification) =>
            notification.id !== notificationId
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error.response?.data || error
      );

      alert("Failed to delete notification");
    }
  }

  function getIcon(type) {
    switch (type) {
      case "LIKE":
        return "❤️";

      case "COMMENT":
        return "💬";

      case "FOLLOW":
        return "👤";

      default:
        return "🔔";
    }
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="p-6">
          Please log in first.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl p-4 sm:p-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Notifications
            </h1>

            <p className="mt-1 text-slate-500">
              Stay updated with your activity.
            </p>
          </div>

          <button
            type="button"
            onClick={loadNotifications}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Refresh
          </button>
        </div>

        <div className="mt-6 space-y-3">

          {loading ? (
            <p className="text-center text-slate-500">
              Loading notifications...
            </p>
          ) : notifications.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <div className="text-4xl">
                🔔
              </div>

              <p className="mt-3 font-medium text-slate-700">
                No notifications yet.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Likes, comments, and new followers will
                appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const isRead =
                notification.read ||
                notification.isRead;

              return (
                <div
                  key={notification.id}
                  className={`flex items-center gap-4 rounded-xl p-4 shadow-sm transition ${
                    isRead
                      ? "bg-white"
                      : "bg-blue-50"
                  }`}
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                    {getIcon(notification.type)}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p
                      className={`text-sm ${
                        isRead
                          ? "text-slate-600"
                          : "font-semibold text-slate-900"
                      }`}
                    >
                      {notification.message}
                    </p>

                    {!isRead && (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800"
                      >
                        Mark as read
                      </button>
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      deleteNotification(
                        notification.id
                      )
                    }
                    className="shrink-0 text-sm text-slate-400 hover:text-red-600"
                  >
                    ✕
                  </button>

                </div>
              );
            })
          )}

        </div>
      </div>
    </MainLayout>
  );
}

export default NotificationsPage;