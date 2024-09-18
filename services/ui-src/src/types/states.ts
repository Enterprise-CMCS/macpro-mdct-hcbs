import {
  ReportTemplate,
  ParentPageTemplate,
  PageData,
  PageTemplate,
  ModalArguments,
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
  parentPage?: PageData; // used for looking up curr & next page
  currentPageId?: string;
  modalOpen: boolean;
  modalArgs?: ModalArguments;

  // ACTIONS
  setReport: (report?: ReportTemplate) => void;
  setParentPage: (parentPage?: PageData) => void;
  setCurrentPageId: (currentPageId: string) => void;
  setModalOpen: (modalOpen: boolean) => void;
  setModalArgs: (modalArgs: ModalArguments) => void;
}
