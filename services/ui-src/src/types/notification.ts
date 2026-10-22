import { ReportType } from "./report";
import { StateAbbr } from "./other";

export interface NotificationAssignment {
  email: string;
  states: StateAbbr[];
  reports: ReportType[];
}

export interface Notification {
  category: ReportType;
  enabled: boolean;
}
