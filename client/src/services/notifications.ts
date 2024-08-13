import { instance } from "./axios";

export const getNotificationsByUser = async () => {
  return await instance.get("/notifications");
};

export const markAllNotificationsAsRead = async () => {
  return await instance.patch("/notifications/mark-all-as-read");
};
