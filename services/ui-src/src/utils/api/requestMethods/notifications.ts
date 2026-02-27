import { apiLib, updateTimeout } from "utils";
import { getRequestHeaders } from "./getRequestHeaders";
import { Notifications } from "types/notifications";

export async function getNotifications() {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  return await apiLib.get<Notifications[]>("/notifications", options);
}

export async function updateNotifications(notification: Notifications) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...notification },
  };

  updateTimeout();
  return await apiLib.put<Notifications[]>("/notifications", options);
}
