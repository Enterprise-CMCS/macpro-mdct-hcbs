import { ReportType } from "./reports";

export interface Notifications {
  category: ReportType;
  enabled: boolean;
}
