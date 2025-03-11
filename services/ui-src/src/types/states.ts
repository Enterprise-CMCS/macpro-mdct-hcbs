import {
  ParentPageTemplate,
  PageData,
  Report,
  MeasurePageTemplate,
} from "types/report";
import { ReactNode } from "react";
import { BannerData, ErrorVerbiage, HcbsUser } from "types";

export interface AdminBannerState {
  bannerData: BannerData | undefined;
  bannerActive: boolean;
  bannerLoading: boolean;
  bannerErrorMessage: ErrorVerbiage | undefined;
  bannerDeleting: boolean;
  // ACTIONS
  setBannerData: (newBannerData: BannerData | undefined) => void;
  clearAdminBanner: () => void;
  setBannerActive: (bannerStatus: boolean) => void;
  setBannerLoading: (bannerLoading: boolean) => void;
  setBannerErrorMessage: (
    bannerErrorMessage: ErrorVerbiage | undefined
  ) => void;
  setBannerDeleting: (bannerDeleting: boolean) => void;
}

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
  modalHeader?: string;
  modalComponent?: ReactNode;
  lastSavedTime?: string;
  errorMessage?: string;

  // ACTIONS
  setReport: (report?: Report) => void;
  setCurrentPageId: (currentPageId: string) => void;
  setModalOpen: (modalOpen: boolean) => Promise<void>;
  setModalComponent: (modalComponent: ReactNode, modalHeader: string) => void;
  setAnswers: (answers: any) => Promise<void>;
  clearMeasure: (measureId: string, ignoreList: string[]) => void;
  resetMeasure: (measureId: string) => void;
  setSubstitute: (report: Report, selectMeasure: MeasurePageTemplate) => void;
}
