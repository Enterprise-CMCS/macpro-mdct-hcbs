import { apiLib } from "../apiLib";
import { updateTimeout } from "../../auth/authLifecycle";
import { getRequestHeaders } from "./getRequestHeaders";
import { NotificationAssignment } from "types/notification";
import { StateAbbr } from "types/other";
import { ReportType } from "types/report";

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

export const getEmailsForReportAndState = async (
  reportType: ReportType,
  state: StateAbbr
) => {
  const headers = await getRequestHeaders();
  updateTimeout();
  return await apiLib.get<string[]>(
    `/notification-assignments/emails/${reportType}/${state}`,
    { headers }
  );
};

export const putNotificationAssignment = async (
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
