import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  HcbsUserState,
  HcbsUser,
  HcbsReportState,
  HcbsBannerState,
  BannerFormData,
} from "types";
import { MeasurePageTemplate, Report } from "types/report";
import { ReactNode } from "react";
import {
  buildState,
  changeDeliveryMethods,
  clearMeasure,
  markPageComplete,
  mergeAnswers,
  resetMeasure,
  saveReport,
  setPage,
  substitute,
} from "./reportLogic/reportActions";
import { getBanners, createBanner, deleteBanner } from "utils";

// USER STORE
const userStore = (set: Set<HcbsUserState>) => ({
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
const bannerStore = (set: Set<HcbsBannerState>, get: Get<HcbsBannerState>) => ({
  // initial state
  allBanners: [],
  _lastFetchTime: 0,
  fetchBanners: async () => {
    const allBanners = await getBanners();
    set({ allBanners, _lastFetchTime: Date.now() });
  },
  createBanner: async (banner: BannerFormData) => {
    await createBanner(banner);
    await get().fetchBanners();
  },
  deleteBanner: async (bannerKey: string) => {
    await deleteBanner(bannerKey);
    await get().fetchBanners();
  },
});

// REPORT STORE
const reportStore = (set: Set<HcbsReportState>, get: Get<HcbsReportState>) => ({
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
  sidebarOpen: true,

  // actions
  loadReport: (report: Report | undefined) =>
    set(() => buildState(report, false), false, {
      type: "loadReport",
    }),
  updateReport: (report: Report | undefined) =>
    set(() => buildState(report, true), false, {
      type: "updateReport",
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
  setAnswers: (answers: any) =>
    set((state: HcbsReportState) => mergeAnswers(answers, state), false, {
      type: "setAnswers",
    }),
  setSubstitute: (
    report: Report,
    selectMeasure: MeasurePageTemplate | undefined
  ) => {
    set(() => substitute(report, selectMeasure), false, {
      type: "setSubstitute",
    });
  },
  setSidebar: (sidebarOpen: boolean) => {
    set(() => ({ sidebarOpen }), false, { type: "setSidebarOpen" });
  },
  completePage: (measureId: string) => {
    set((state: HcbsReportState) => markPageComplete(measureId, state), false, {
      type: "completePage",
    });
  },
  resetMeasure: (measureId: string) =>
    set((state: HcbsReportState) => resetMeasure(measureId, state), false, {
      type: "resetMeasure",
    }),
  clearMeasure: (measureId: string, ignoreList: { [key: string]: string }) =>
    set(
      (state: HcbsReportState) => clearMeasure(measureId, state, ignoreList),
      false,
      {
        type: "clearMeasure",
      }
    ),
  changeDeliveryMethods: (measureId: string, selection: string) =>
    set(
      (state: HcbsReportState) =>
        changeDeliveryMethods(measureId, selection, state),
      false,
      {
        type: "changeDeliveryMethods",
      }
    ),
  saveReport: async () => {
    const state = get();
    const result = await saveReport(state);
    set(result, false, { type: "saveReport" });
  },
});

export const useStore = create(
  // devtools is being used for debugging state
  persist(
    devtools<HcbsUserState & HcbsReportState & HcbsBannerState>((set, get) => ({
      ...userStore(set),
      ...bannerStore(set, get),
      ...reportStore(set, get),
    })),
    {
      name: "hcbs-store",
      partialize: (state) => ({ report: state.report }),
    }
  )
);

/*
 * Zustand doesn't directly export the type signatures of its callbacks.
 * but we can access them indirectly with the Parameters utility type.
 */

/** The type of a Set callback within Zustand. */
type Set<TState> = Parameters<Parameters<typeof devtools<TState>>[0]>[0];

/** The type of a Get callback within Zustand. */
type Get<TState> = Parameters<Parameters<typeof devtools<TState>>[0]>[1];
