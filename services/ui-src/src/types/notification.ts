import { ReportType } from "./report";

export interface Notification {
  category: ReportType;
  enabled: boolean;
}
