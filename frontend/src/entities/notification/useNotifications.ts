import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getNotificationCount,
  markAsRead,
  markAllRead,
} from "./api";

// GET LIST
export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    retry: 2,
  });
};

// COUNT
export const useNotificationCount = () => {
  return useQuery({
    queryKey: ["notification-count"],
    queryFn: getNotificationCount,
    retry: 2,
  });
};

// MARK ONE
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
    },
  });
};

// MARK ALL
export const useMarkAllRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
    },
  });
};