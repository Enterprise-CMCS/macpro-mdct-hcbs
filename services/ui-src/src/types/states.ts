import {
  ParentPageTemplate,
  PageData,
  PageTemplate,
  Report,
} from "types/report";
import React from "react";
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
  report?: Report; // TODO: report, not template
  pageMap?: Map<string, PageTemplate>;
  rootPage?: ParentPageTemplate;
  parentPage?: PageData; // used for looking up curr & next page
  currentPageId?: string;
  modalOpen: boolean;
  modalComponent?: React.ReactFragment;

  // ACTIONS
  setReport: (report?: Report) => void;
  setParentPage: (parentPage?: PageData) => void;
  setCurrentPageId: (currentPageId: string) => void;
  setModalOpen: (modalOpen: boolean) => void;
  setModalComponent: (modalComponent: React.ReactFragment) => void;
}
