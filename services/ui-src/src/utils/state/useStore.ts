import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { HcbsUserState, HcbsUser, HcbsReportState } from "types";
import {
  ReportTemplate,
  ParentPageTemplate,
  PageData,
  PageTemplate,
  ModalArguments,
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
const reportStore = (set: Function): HcbsReportState => ({
  // initial state
  report: undefined, // raw report
  pageMap: undefined, // all pages mapped by Id
  rootPage: undefined, // root node
  parentPage: undefined, // active parent (tracks prev/next page)
  currentPageId: undefined,
  modalOpen: false,
  modalArgs: undefined,

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
        const findParentPage = [...state.pageMap!.values()].find((parentPage) =>
          parentPage?.childPageIds?.includes(currentPageId)
        );
        let parentPage = undefined;
        if (findParentPage) {
          // @ts-ignore TODO
          const pageIndex = findParentPage.childPageIds.findIndex(
            (pageId) => pageId === currentPageId
          );
          parentPage = {
            parent: findParentPage.id,
            childPageIds: findParentPage.childPageIds!,
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
  setModalArgs: (modalArgs: ModalArguments) =>
    set(() => ({ modalArgs, modalOpen: true }), false, {
      type: "setModalArgs",
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
