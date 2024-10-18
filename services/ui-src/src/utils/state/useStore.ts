import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { HcbsUserState, HcbsUser, HcbsReportState } from "types";
import { ParentPageTemplate, PageData, Report } from "types/report";
import React from "react";

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
  setReport: (report: Report | undefined) => {
    if (!report) {
      return set(() => ({ report: undefined }), false, {
        type: "setReport",
      });
    }
    const pageMap = new Map<string, number>(
      report.pages.map((page, index) => [page.id, index])
    );
    const rootPage = report.pages[pageMap.get("root")!] as ParentPageTemplate; // this cast is safe, per unit tests
    const parentPage = {
      parent: rootPage.id,
      childPageIds: rootPage.childPageIds,
      index: 0,
    };
    const currentPageId = parentPage.childPageIds[parentPage.index];
    return set(
      () => ({ report, pageMap, rootPage, parentPage, currentPageId }),
      false,
      {
        type: "setReport",
      }
    );
  },
  setCurrentPageId: (currentPageId: string) =>
    set(
      (state: HcbsReportState) => {
        const parent = state.report?.pages.find((parentPage) =>
          parentPage?.childPageIds?.includes(currentPageId)
        );
        let parentPage = undefined;
        if (parent) {
          // @ts-ignore TODO
          const pageIndex = parent.childPageIds.findIndex(
            (pageId) => pageId === currentPageId
          );
          parentPage = {
            parent: parent.id,
            childPageIds: parent.childPageIds!,
            index: pageIndex,
          };
        }
        return { currentPageId, parentPage };
      },
      false,
      { type: "setCurrentPageId" }
    ),
  setParentPage: (parentPage: PageData | undefined) =>
    set(() => ({ parentPage }), false, { type: "setParentPage" }),
  setModalOpen: (modalOpen: boolean) =>
    set(() => ({ modalOpen }), false, { type: "setModalOpen" }),
  setModalComponent: (modalComponent: React.ReactFragment) =>
    set(() => ({ modalComponent, modalOpen: true }), false, {
      type: "setModalComponent",
    }),
  setAnswers: (answers) => {
    const mergeAction = (state: HcbsReportState) => {
      if (!state.report) return;
      const report = structuredClone(state.report);
      const pageIndex = state.report.pages.findIndex(
        (page) => page.id === state.currentPageId
      );
      report.pages[pageIndex] = deepMerge(report.pages[pageIndex], answers);
      return { report };
    };
    set(mergeAction, false, {
      type: "setAnswers",
    });
  },
});

const deepMerge = (obj1: any, obj2: any) => {
  const clone1 = structuredClone(obj1);
  const clone2 = structuredClone(obj2);
  for (let key in clone2) {
    if (clone2[key] instanceof Object && clone1[key] instanceof Object) {
      clone1[key] = deepMerge(clone1[key], clone2[key]);
    } else {
      clone1[key] = clone2[key];
    }
  }
  return clone1;
};

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
