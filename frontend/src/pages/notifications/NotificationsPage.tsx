import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useNotifications,
  useNotificationCount,
  useMarkAsRead,
  useMarkAllRead,
} from "../../entities/notification/useNotifications";

const NotificationsPage = () => {
  const navigate = useNavigate();

  const {
    data: notifications,
    isLoading,
    isError,
  } = useNotifications();

  const { data: countData } = useNotificationCount();

  const markRead = useMarkAsRead();
  const markAll = useMarkAllRead();

  const [filter, setFilter] = useState("all");

  const list = notifications || [];

  // FILTER
  const filtered = useMemo(() => {
    return list.filter((n: any) => {
      if (filter === "unread") return n.status === "unread";
      if (filter === "read") return n.status === "read";
      return true;
    });
  }, [list, filter]);

  const unreadCount =
    countData?.unread ??
    list.filter((n: any) => n.status === "unread").length;

  // NAVIGATION
  const handleClick = (n: any) => {
    if (n.entity_type === "assessment") {
      navigate(`/assessments/${n.entity_id}`);
    }
  };

  // LOADING
  if (isLoading) {
    return <div className="p-6">Loading notifications...</div>;
  }

  // ERROR
  if (isError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load notifications. Please try again.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Notifications ({unreadCount})
        </h2>

        <button
          disabled={markAll.isPending}
          onClick={() => {
            markAll.mutate(undefined, {
              onSuccess: () => toast.success("All marked as read"),
              onError: () => toast.error("Failed to update"),
            });
          }}
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Mark All Read
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-4">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("unread")}>Unread</button>
        <button onClick={() => setFilter("read")}>Read</button>
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div>No notifications available</div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {filtered.map((n: any) => (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            className={`p-4 border rounded flex justify-between cursor-pointer ${
              n.status === "unread" ? "bg-gray-100" : ""
            }`}
          >
            <div>
              <p className={n.status === "unread" ? "font-semibold" : ""}>
                {n.message}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>

            {n.status === "unread" && (
              <button
                disabled={markRead.isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  markRead.mutate(n.id, {
                    onSuccess: () => toast.success("Marked as read"),
                    onError: () => toast.error("Failed to update"),
                  });
                }}
                className="text-sm text-blue-600 disabled:opacity-50"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;