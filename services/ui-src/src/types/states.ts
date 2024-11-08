import { ParentPageTemplate, PageData, Report } from "types/report";
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
  report?: Report;
  pageMap?: Map<string, number>;
  rootPage?: ParentPageTemplate;
  parentPage?: PageData; // used for looking up curr & next page
  currentPageId?: string;
  modalOpen: boolean;
  modalComponent?: React.ReactFragment;
  lastSavedTime: string | undefined;
  isReportPage: boolean;

  // ACTIONS
  setReport: (report?: Report) => void;
  setCurrentPageId: (currentPageId: string) => void;
  setModalOpen: (modalOpen: boolean) => void;
  setModalComponent: (modalComponent: React.ReactFragment) => void;
  setAnswers: (answers: any) => void;
}
