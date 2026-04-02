import client from "../../shared/api/client";

// GET ALL (no pagination as per backend)
export const getNotifications = async () => {
  const res = await client.get("/notifications/");
  return res.data;
};

// COUNT
export const getNotificationCount = async () => {
  const res = await client.get("/notifications/count/");
  return res.data;
};

// MARK ONE
export const markAsRead = async (id: number) => {
  return client.patch(`/notifications/${id}/mark-read/`);
};

// MARK ALL
export const markAllRead = async () => {
  return client.post("/notifications/read-all/");
};