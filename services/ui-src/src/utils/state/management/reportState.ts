import { HcbsReportState } from "types";
import { ParentPageTemplate, Report } from "types/report";
import { putReport } from "utils/api/requestMethods/report";
import { getLocalHourMinuteTime } from "utils";

export const buildState = (report: Report | undefined) => {
  if (!report) return { report: undefined };
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

  return { report, pageMap, rootPage, parentPage, currentPageId };
};

export const setPage = (
  targetPageId: string,
  currentState: HcbsReportState
) => {
  const parent = currentState.report?.pages.find((parentPage) =>
    parentPage?.childPageIds?.includes(targetPageId)
  );

  let parentPage = undefined;
  if (parent) {
    // @ts-ignore TODO
    const pageIndex = parent.childPageIds.findIndex(
      (pageId) => pageId === targetPageId
    );
    parentPage = {
      parent: parent.id,
      childPageIds: parent.childPageIds!,
      index: pageIndex,
    };
  }
  return { currentPageId: targetPageId, parentPage };
};

export const deepMerge = (obj1: any, obj2: any) => {
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

export const mergeAnswers = (answers: any, state: HcbsReportState) => {
  if (!state.report) return;
  const report = structuredClone(state.report);
  const pageIndex = state.report.pages.findIndex(
    (page) => page.id === state.currentPageId
  );
  report.pages[pageIndex] = deepMerge(report.pages[pageIndex], answers);

  putReport(report); // Submit to API
  return { report, lastSavedTime: getLocalHourMinuteTime() };
};
