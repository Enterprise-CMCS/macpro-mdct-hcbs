import { ReportType } from "./reports";
import { StateAbbr } from "../utils/constants";

export interface Notification {
  category: ReportType;
  enabled: boolean;
}

export interface NotificationRecipientRecord {
  state: StateAbbr;
  id: string;
  email: string;
}
