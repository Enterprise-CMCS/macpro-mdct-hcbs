import { apiLib } from "../apiLib";
import { updateTimeout } from "../../auth/authLifecycle";
import { getRequestHeaders } from "./getRequestHeaders";
import { NotificationAssignment } from "types/notification";

export const getNotificationAssignments = async () => {
  const headers = await getRequestHeaders();
  updateTimeout();
  return await apiLib.get<NotificationAssignment[]>(
    "/notification-assignments",
    {
      headers,
    }
  );
};

export const createNotificationAssignment = async (
  assignment: NotificationAssignment
) => {
  const headers = await getRequestHeaders();
  updateTimeout();
  return await apiLib.post<NotificationAssignment>(
    "/notification-assignments",
    {
      headers,
      body: assignment,
    }
  );
};

export const updateNotificationAssignment = async (
  assignment: NotificationAssignment
) => {
  const headers = await getRequestHeaders();
  updateTimeout();
  return await apiLib.put<NotificationAssignment>("/notification-assignments", {
    headers,
    body: assignment,
  });
};

export const deleteNotificationAssignment = async (email: string) => {
  const headers = await getRequestHeaders();
  updateTimeout();
  return await apiLib.del(
    `/notification-assignments/${encodeURIComponent(email)}`,
    { headers }
  );
};
