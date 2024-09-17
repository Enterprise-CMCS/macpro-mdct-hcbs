import {
  PageData,
  PageTemplate,
  ParentPageTemplate,
  ReportTemplate,
} from "components/Example/types";
import { HcbsUser } from "types";

// initial user state
export interface HcbsUserState {
  // INITIAL STATE
  user?: HcbsUser;
  showLocalLogins: boolean | undefined;
  // ACTIONS
  setUser: (newUser?: HcbsUser) => void;
  setShowLocalLogins: (showLocalLogins: boolean) => void;
}

export interface HcbsReportState {
  // INITIAL STATE
  report?: ReportTemplate; // TODO: report, not template
  pageMap?: Map<string, PageTemplate>;
  rootPage?: ParentPageTemplate;
  parentPage?: PageData;
  // ACTIONS
  setReport: (report?: ReportTemplate) => void;
  setParentPage: (currentPage?: PageData) => void;
}
