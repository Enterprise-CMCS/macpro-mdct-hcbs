import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { HcbsUserState, HcbsUser, HcbsReportState } from "types";
import { Report } from "types/report";
import React from "react";
import { buildState, mergeAnswers, setPage } from "./management/reportState";

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
});

export const useStore = create(
  // devtools is being used for debugging state
  persist(
    devtools<HcbsUserState & HcbsReportState>((set) => ({
      ...userStore(set),
      ...reportStore(set),
    })),
    {
      name: "hcbs-store",
      partialize: () => ({}),
    }
  )
);
