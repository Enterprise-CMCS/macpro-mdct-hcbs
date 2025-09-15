import {
  HcbsReportState,
  PageStatus,
  ParentPageTemplate,
  ReportStatus,
} from "types";
import {
  inferredReportStatus,
  pageIsCompletable,
} from "./reportLogic/completeness";

export const currentPageSelector = (state: HcbsReportState) => {
  const { report, pageMap, currentPageId } = state;

  if (!report || !pageMap || !currentPageId) {
    return null;
  }

  const currentPage = report.pages[pageMap.get(currentPageId)!];
  return currentPage;
};

export const elementSelector = (elementId: string) => {
  return (state: HcbsReportState) => {
    const currentPage = currentPageSelector(state);
    const element = currentPage?.elements?.find((el) => el.id === elementId);
    return element;
  };
};

export const currentPageCompletableSelector = (state: HcbsReportState) => {
  if (!state.report || !state.currentPageId) return false;
  return pageIsCompletable(state.report, state.currentPageId);
};

export const submittableMetricsSelector = (state: HcbsReportState) => {
  const { report, pageMap } = state;
  if (!report || !pageMap) {
    return null;
  }

  const childPages = (report.pages[pageMap.get("root")!] as ParentPageTemplate)
    .childPageIds;
  const sections = childPages.slice(0, -1).map((id) => {
    const pageIdx = pageMap.get(id);
    if (!pageIdx) return null;
    const section = report.pages[pageIdx] as ParentPageTemplate;
    let displayStatus = inferredReportStatus(report, section.id);
    let submittable = displayStatus === PageStatus.COMPLETE;

    if (section.id === "optional-measure-result") {
      submittable = displayStatus !== PageStatus.IN_PROGRESS;
      if (displayStatus === PageStatus.NOT_STARTED) displayStatus = undefined;
    }

    return {
      section: section,
      displayStatus: displayStatus,
      submittable: submittable,
    };
  });

  const allPagesSubmittable = sections.every(
    (sectionInfo) => !!sectionInfo?.submittable
  );
  const submittable =
    report.status !== ReportStatus.SUBMITTED && allPagesSubmittable;

  return { sections: sections, submittable: submittable };
};
