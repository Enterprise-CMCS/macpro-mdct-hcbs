import {
  ParentPageTemplate,
  PageData,
  Report,
  MeasurePageTemplate,
} from "types/report";
import { ReactNode } from "react";
import { BannerShape, BannerFormData, HcbsUser } from "types";

export interface HcbsBannerState {
  /** All banners, active and inactive, for every area of the site */
  allBanners: BannerShape[];
  /** When was the last time banners were fetched? */
  _lastFetchTime: number;
  /** Refresh the `allBanners` list */
  fetchBanners: () => Promise<void>;
  createBanner: (data: BannerFormData) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
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
  sidebarOpen: boolean;

  // ACTIONS
  loadReport: (report?: Report) => void;
  updateReport: (report?: Report) => void;
  setCurrentPageId: (currentPageId: string) => void;
  setModalOpen: (modalOpen: boolean) => void;
  setModalComponent: (modalComponent: ReactNode, modalHeader: string) => void;
  setAnswers: (answers: any) => void;
  clearMeasure: (
    measureId: string,
    ignoreList: { [key: string]: string }
  ) => void;
  changeDeliveryMethods: (measureId: string, selection: string) => void;
  completePage: (measureId: string) => void;
  resetMeasure: (measureId: string) => void;
  setSubstitute: (
    report: Report,
    selectMeasure: MeasurePageTemplate | undefined
  ) => void;
  setSidebar: (sidebarOpen: boolean) => void;
  saveReport: () => void;
}
