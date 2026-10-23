import { ReportType } from "./reports";
import { StateAbbr, isStateAbbreviation } from "../utils/constants";

export type NotificationState = StateAbbr | "ALL";

export const isNotificationState = (
  value: string | undefined
): value is NotificationState => value === "ALL" || isStateAbbreviation(value);

export interface NotificationAssignment {
  email: string;
  states: NotificationState[];
  reports: ReportType[];
}

export interface Notification {
  category: ReportType;
  enabled: boolean;
}
