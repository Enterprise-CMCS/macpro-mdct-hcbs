import { ReportType } from "./reports";

export interface Notification {
  category: ReportType;
  enabled: boolean;
}
