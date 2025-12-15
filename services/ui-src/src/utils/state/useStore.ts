import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  UserState,
  User,
  ReportState,
  BannerData,
  ErrorVerbiage,
  AdminBannerState,
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

// USER STORE
const userStore = (set: Set<UserState>) => ({
  // initial state
  user: undefined,
  // show local logins
  showLocalLogins: undefined,
  // actions
  setUser: (newUser?: User) =>
    set(() => ({ user: newUser }), false, { type: "setUser" }),
  // toggle show local logins (dev only)
  setShowLocalLogins: () =>
    set(() => ({ showLocalLogins: true }), false, { type: "showLocalLogins" }),
});

// BANNER STORE
const bannerStore = (set: Set<AdminBannerState>) => ({
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
const reportStore = (set: Set<ReportState>, get: Get<ReportState>) => ({
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
    set((state: ReportState) => setPage(currentPageId, state), false, {
      type: "setCurrentPageId",
    }),
  setModalOpen: (modalOpen: boolean) =>
    set(() => ({ modalOpen }), false, { type: "setModalOpen" }),
  setModalComponent: (modalComponent: ReactNode, modalHeader: string) =>
    set(() => ({ modalComponent, modalOpen: true, modalHeader }), false, {
      type: "setModalComponent",
    }),
  setAnswers: (answers: any) =>
    set((state: ReportState) => mergeAnswers(answers, state), false, {
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
    set((state: ReportState) => markPageComplete(measureId, state), false, {
      type: "completePage",
    });
  },
  resetMeasure: (measureId: string) =>
    set((state: ReportState) => resetMeasure(measureId, state), false, {
      type: "resetMeasure",
    }),
  clearMeasure: (measureId: string, ignoreList: { [key: string]: string }) =>
    set(
      (state: ReportState) => clearMeasure(measureId, state, ignoreList),
      false,
      {
        type: "clearMeasure",
      }
    ),
  changeDeliveryMethods: (measureId: string, selection: string) =>
    set(
      (state: ReportState) =>
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
    devtools<UserState & ReportState & AdminBannerState>((set, get) => ({
      ...userStore(set),
      ...bannerStore(set),
      ...reportStore(set, get),
    })),
    {
      name: "labs-store",
      partialize: (state) => ({ report: state.report }),
    }
  )
);

/*
 * Zustand doesn't directly export the type signatures of its callbacks.
 * These were manually written to precisely match what Zustand expects,
 * as of Zustand v4.5.2
 *
 * Note that it _is_ possible to access these types indirectly.
 * For example, Set<T> is `Parameters<Parameters<typeof devtools<T>>[0][0]`.
 * However, even though Typescript can handle that, our linter currently cannot.
 * If/when we upgrade our linter, it may be worthwhile to switch to that method.
 */

/** The type of a Set callback within Zustand. */
type Set<TState> = <A extends string | { type: string }>(
  partial:
    | TState
    | Partial<TState>
    | ((state: TState) => TState | Partial<TState>),
  replace?: boolean,
  action?: A
) => void;

/** The type of a Get callback within Zustand. */
type Get<TState> = () => TState;
