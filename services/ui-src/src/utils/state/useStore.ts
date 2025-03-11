import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  HcbsUserState,
  HcbsUser,
  HcbsReportState,
  BannerData,
  ErrorVerbiage,
  AdminBannerState,
} from "types";
import { MeasurePageTemplate, Report } from "types/report";
import { ReactNode } from "react";
import {
  buildState,
  clearMeasure,
  mergeAnswers,
  resetMeasure,
  setPage,
  substitute,
} from "./management/reportState";

// USER STORE
const userStore = (set: Function) => ({
  // initial state
  user: undefined,
  // show local logins
  showLocalLogins: undefined,
  // actions
  setUser: (newUser?: HcbsUser) =>
    set(() => ({ user: newUser }), false, { type: "setUser" }),
  // toggle show local logins (dev only)
  setShowLocalLogins: () =>
    set(() => ({ showLocalLogins: true }), false, { type: "showLocalLogins" }),
});

// BANNER STORE
const bannerStore = (set: Function) => ({
  // initial state
  bannerData: undefined,
  bannerActive: false,
  bannerLoading: false,
  bannerErrorMessage: undefined,
  bannerDeleting: false,
  // actions
  setBannerData: (newBanner: BannerData | undefined) =>
    set(() => ({ bannerData: newBanner }), false, { type: "setBannerData" }),
  clearAdminBanner: () =>
    set(() => ({ bannerData: undefined }), false, { type: "clearAdminBanner" }),
  setBannerActive: (bannerStatus: boolean) =>
    set(() => ({ bannerActive: bannerStatus }), false, {
      type: "setBannerActive",
    }),
  setBannerLoading: (loading: boolean) =>
    set(() => ({ bannerLoading: loading }), false, {
      type: "setBannerLoading",
    }),
  setBannerErrorMessage: (errorMessage: ErrorVerbiage | undefined) =>
    set(() => ({ bannerErrorMessage: errorMessage }), false, {
      type: "setBannerErrorMessage",
    }),
  setBannerDeleting: (deleting: boolean) =>
    set(() => ({ bannerDeleting: deleting }), false, {
      type: "setBannerDeleting",
    }),
});

// REPORT STORE
const reportStore = (set: Function, get: Function): HcbsReportState => ({
  // initial state
  report: undefined, // raw report
  pageMap: undefined, // all page indexes mapped by Id
  rootPage: undefined, // root node
  parentPage: undefined, // active parent (tracks prev/next page)
  currentPageId: undefined,
  modalOpen: false,
  modalHeader: undefined,
  modalComponent: undefined,
  lastSavedTime: undefined,
  errorMessage: undefined,

  // actions
  setReport: (report: Report | undefined) =>
    set(() => buildState(report), false, {
      type: "setReport",
    }),
  setCurrentPageId: (currentPageId: string) =>
    set((state: HcbsReportState) => setPage(currentPageId, state), false, {
      type: "setCurrentPageId",
    }),
  setModalOpen: (modalOpen: boolean) =>
    set(() => ({ modalOpen }), false, { type: "setModalOpen" }),
  setModalComponent: (modalComponent: ReactNode, modalHeader: string) =>
    set(() => ({ modalComponent, modalOpen: true, modalHeader }), false, {
      type: "setModalComponent",
    }),
  setAnswers: async (answers) => {
    const state = get();
    const merged = await mergeAnswers(answers, state);
    set(merged, false, {
      type: "setAnswers",
    });
  },
  setSubstitute: async (report: Report, selectMeasure: MeasurePageTemplate) => {
    const newReport = await substitute(report, selectMeasure);
    set(newReport, false, {
      type: "setSubstitute",
    });
  },
  resetMeasure: async (measureId: string) => {
    const state = get();
    const update = await resetMeasure(measureId, state);
    set(update, false, {
      type: "resetMeasure",
    });
  },
  clearMeasure: async (measureId: string, ignoreList: string[]) => {
    const state = get();
    const update = await clearMeasure(measureId, state, ignoreList);
    set(update, false, {
      type: "clearMeasure",
    });
  },
});

export const useStore = create(
  // devtools is being used for debugging state
  persist(
    devtools<HcbsUserState & HcbsReportState & AdminBannerState>(
      (set, get) => ({
        ...userStore(set),
        ...bannerStore(set),
        ...reportStore(set, get),
      })
    ),
    {
      name: "hcbs-store",
      partialize: (state) => ({ report: state.report }),
    }
  )
);
