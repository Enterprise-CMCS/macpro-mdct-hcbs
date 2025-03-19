import { HcbsReportState } from "types";

export const currentPageSelector = (state: HcbsReportState) => {
  const { report, pageMap, currentPageId } = state;
  if (!report || !pageMap || !currentPageId) {
    return null;
  }

  const currentPage = report.pages[pageMap.get(currentPageId)!];
  return currentPage;
};
