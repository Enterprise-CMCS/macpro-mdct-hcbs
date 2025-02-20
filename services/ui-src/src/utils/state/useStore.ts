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
import React from "react";
import {
  buildState,
  mergeAnswers,
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
const reportStore = (set: Function): HcbsReportState => ({
  // initial state
  report: undefined, // raw report
  pageMap: undefined, // all page indexes mapped by Id
  rootPage: undefined, // root node
  parentPage: undefined, // active parent (tracks prev/next page)
  currentPageId: undefined,
  modalOpen: false,
  modalComponent: undefined,
  lastSavedTime: undefined,
  cmit: undefined,

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
  setModalComponent: (modalComponent: React.ReactFragment) =>
    set(() => ({ modalComponent, modalOpen: true }), false, {
      type: "setModalComponent",
    }),
  setAnswers: (answers) =>
    set((state: HcbsReportState) => mergeAnswers(answers, state), false, {
      type: "setAnswers",
    }),
  setMeasure: (cmit: number) => {
    set(() => ({ cmit }), false, { type: "setMeasure" });
  },
  setSubstitute: (report: Report, selectMeasure: MeasurePageTemplate) => {
    set(() => substitute(report, selectMeasure), false, {
      type: "setSubstitute",
    });
  },
});

export const useStore = create(
  // devtools is being used for debugging state
  persist(
    devtools<HcbsUserState & HcbsReportState & AdminBannerState>((set) => ({
      ...userStore(set),
      ...bannerStore(set),
      ...reportStore(set),
    })),
    {
      name: "hcbs-store",
      partialize: (state) => ({ report: state.report }),
    }
  )
);
