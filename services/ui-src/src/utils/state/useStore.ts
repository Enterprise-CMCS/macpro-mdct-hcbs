import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { HcbsUserState, HcbsUser, HcbsReportState } from "types";
import {
  PageData,
  PageTemplate,
  ParentPageTemplate,
  ReportTemplate,
} from "components/Example/types";

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
const reportStore = (set: Function) => ({
  // initial state
  report: undefined, // raw report
  pageMap: undefined, // all pages mapped by Id
  rootPage: undefined, // root node
  parentPage: undefined, // active parent (tracks prev/next page)
  // actions
  setReport: (report: ReportTemplate | undefined) => {
    if (!report) {
      return set(() => ({ report: undefined }), false, {
        type: "setReport",
      });
    }
    const pageMap = new Map<string, PageTemplate>();
    for (const page of report.pages) {
      pageMap.set(page.id, page);
    }
    const rootPage = pageMap.get("root") as ParentPageTemplate; // this cast is safe, per unit tests
    const parentPage = {
      parent: rootPage.id,
      childPageIds: rootPage.childPageIds,
      index: 0,
    };
    return set(() => ({ report, pageMap, rootPage, parentPage }), false, {
      type: "setReport",
    });
  },
  setParentPage: (parentPage: PageData | undefined) =>
    set(() => ({ parentPage }), false, { type: "setParentPage" }),
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
