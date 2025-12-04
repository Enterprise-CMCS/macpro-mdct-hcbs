/**
 * File wrapping high level actions away from the useStore file for cleanliness.
 * This contains the root for logic for actions such as updating an answer, handling resetting, saving, etc.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HcbsReportState } from "types";
import {
  FormPageTemplate,
  isMeasurePageTemplate,
  isMeasureTemplate,
  MeasurePageTemplate,
  PageStatus,
  PageType,
  ParentPageTemplate,
  Report,
} from "types/report";
import { putReport, postSubmitReport } from "utils/api/requestMethods/report";
import { getLocalHourMinuteTime } from "utils";
import { performClearMeasure, performResetMeasure } from "./reset";

export const buildState = (
  report: Report | undefined,
  preserveCurrentPage: boolean
) => {
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
  const state: Partial<HcbsReportState> = {
    report,
    pageMap,
    rootPage,
    parentPage,
    currentPageId,
  };
  if (preserveCurrentPage) delete state.currentPageId;
  return state;
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

export const deepEquals = (obj1: any, obj2: any): boolean => {
  if (typeof obj1 !== typeof obj2) {
    return false;
  } else if (Array.isArray(obj1)) {
    return (
      obj1.length === obj2.length &&
      obj1.every((el, i) => deepEquals(el, obj2[i]))
    );
  } else if (!!obj1 && !!obj2 && typeof obj1 === "object") {
    const entries1 = Object.entries(obj1);
    return (
      entries1.length === Object.entries(obj2).length &&
      entries1.every(([key, val]) => deepEquals(val, obj2[key]))
    );
  } else if (typeof obj1 === "number" && isNaN(obj1) && isNaN(obj2)) {
    return true;
  } else {
    return obj1 === obj2;
  }
};

export const mergeAnswers = (answers: any, state: HcbsReportState) => {
  if (!state.report || !state.currentPageId) {
    return {};
  }
  const report = structuredClone(state.report);
  const pageIndex = state.report.pages.findIndex(
    (page) => page.id === state.currentPageId
  );

  const result = deepMerge(report.pages[pageIndex], answers);

  // If this action didn't change any values, don't dirty the status
  if (deepEquals(report.pages[pageIndex], result)) {
    return {};
  }

  // Handle status dirtying
  if ("status" in result) {
    result.status = PageStatus.IN_PROGRESS;
  }
  for (const page of report.pages) {
    if (
      "dependentPages" in page &&
      page.dependentPages?.find(
        (link) => link.template === state.currentPageId
      ) &&
      "status" in page
    ) {
      page.status = PageStatus.IN_PROGRESS;
    }
  }
  report.pages[pageIndex] = result;

  return { report };
};

export const substitute = (
  report: Report,
  selectMeasure: MeasurePageTemplate | undefined
) => {
  if (!selectMeasure) {
    return { report };
  }

  const measures = report?.pages.filter((page) =>
    isMeasureTemplate(page)
  ) as MeasurePageTemplate[];

  const substitute = selectMeasure?.substitutable?.toString();
  const measure = measures.find((measure) => measure.id.includes(substitute!));
  if (measure) {
    measure.required = true;
    selectMeasure.required = false;
  }

  return { report };
};

export const markPageComplete = (pageId: string, state: HcbsReportState) => {
  if (!state.report) {
    return {};
  }
  const report = structuredClone(state.report);
  const page = report.pages.find(
    (page) => page.id === pageId
  ) as MeasurePageTemplate; // TODO: fix cast

  page.status = PageStatus.COMPLETE;

  return { report };
};

/**
 * Clear all nested content in the measure, preserving an In Progress state,
 * and ignoring any fields with special treatment
 */
export const clearMeasure = (
  measureId: string,
  state: HcbsReportState,
  ignoreList: { [key: string]: string }
) => {
  if (!state.report) {
    return {};
  }
  const report = structuredClone(state.report);
  performClearMeasure(measureId, report, ignoreList);
  return { report };
};

/**
 * Hard reset a measure back to the Not started state
 */
export const resetMeasure = (measureId: string, state: HcbsReportState) => {
  if (!state.report) {
    return {};
  }
  const report = structuredClone(state.report);

  performResetMeasure(measureId, report);
  return { report };
};

/**
 * In QMS, when swapping delivery methods, the content of the unused pages should be purged.
 * @param measureId
 * @param selections
 * @param state
 * @returns A modified report
 */
export const changeDeliveryMethods = (
  measureId: string,
  selections: string,
  state: HcbsReportState
) => {
  if (!state.report || !state.currentPageId || selections === "both") {
    return {};
  }
  const report = structuredClone(state.report);

  const page = report.pages.find((page) => page.id === measureId);

  if (!page || !isMeasurePageTemplate(page) || !page.dependentPages) {
    return {};
  }
  for (const dependentPage of page.dependentPages) {
    const deliverySystemIsSelected = selections
      .split(",")
      .includes(dependentPage.key);
    if (!deliverySystemIsSelected) {
      performResetMeasure(dependentPage.template, report);
    }
  }
  return { report };
};

/**
 * Action saving a report to the api, updates errors or saved status
 */
export const saveReport = async (state: HcbsReportState) => {
  if (!state.report) return {};
  try {
    await putReport(state.report); // Submit to API
  } catch (_) {
    return { errorMessage: "Something went wrong, try again." };
  }
  return { lastSavedTime: getLocalHourMinuteTime() };
};

export const displayDivider = (page: ParentPageTemplate | FormPageTemplate) => {
  if (!page.elements) return false;

  //add elements that already have bottom borders to prevent double diviers on the page
  const hideFromElements = [
    "measureTable",
    "measureResultsNavigationTable",
    "ndrEnhanced",
    "ndr",
    "ndrFields",
    "ndrBasic",
    "lengthOfStay",
  ];
  //find the measureFooter index if the page type is measure & measureResults page, else use the last element's index
  const footerIndex =
    page.type == "measure" || page.type == "measureResults"
      ? page.elements.findIndex((ele) => ele.type == "measureFooter")
      : page.elements?.length;

  return !(
    footerIndex &&
    hideFromElements.includes(page.elements[footerIndex - 1].type)
  );
};
