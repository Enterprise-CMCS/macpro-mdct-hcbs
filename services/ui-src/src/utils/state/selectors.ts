import { HcbsReportState } from "types";
import { pageIsCompletable } from "./reportLogic/completeness";

export const currentPageSelector = (state: HcbsReportState) => {
  const { report, pageMap, currentPageId } = state;
  if (!report || !pageMap || !currentPageId) {
    return null;
  }

  const currentPage = report.pages[pageMap.get(currentPageId)!];
  return currentPage;
};

export const currentPageCompletableSelector = (state: HcbsReportState) => {
  if (!state.report || !state.currentPageId) return false;
  return pageIsCompletable(state.report, state.currentPageId);
};
