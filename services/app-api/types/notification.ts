import { ReportType } from "./reports";
import { StateAbbr } from "../utils/constants";

export interface NotificationAssignment {
  email: string;
  states: StateAbbr[];
  reports: ReportType[];
}

export interface Notification {
  category: ReportType;
  enabled: boolean;
}
