import { StateNames } from "../constants";
import { ReportType } from "./report";
import { isStateAbbr, StateAbbr } from "./other";

export const NotificationStateNames = { ALL: "All", ...StateNames };

export type NotificationState = StateAbbr | "ALL";

export const isNotificationState = (
  value: string | undefined
): value is NotificationState => value === "ALL" || isStateAbbr(value);

export interface NotificationAssignment {
  email: string;
  states: NotificationState[];
  reports: ReportType[];
}

export interface Notification {
  category: ReportType;
  enabled: boolean;
}
