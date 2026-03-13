import { apiLib, updateTimeout } from "utils";
import { getRequestHeaders } from "./getRequestHeaders";
import { Notification } from "types/notification";

export async function getNotifications() {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  return await apiLib.get<Notification[]>("/notifications", options);
}

export async function updateNotifications(notification: Notification) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...notification },
  };

  updateTimeout();
  return await apiLib.put<Notification[]>("/notifications", options);
}
