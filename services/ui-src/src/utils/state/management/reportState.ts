/* eslint-disable @typescript-eslint/no-unused-vars */
import { HcbsReportState } from "types";
import {
  isMeasureTemplate,
  MeasurePageTemplate,
  ParentPageTemplate,
  Report,
} from "types/report";
import { putReport } from "utils/api/requestMethods/report";
import { getLocalHourMinuteTime } from "utils";
import { performClearMeasure, performResetMeasure } from "./reset";

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

/**
 * Remove any answers with errors on them recursively, using the structure of answers and errors from react-hook-form.
 *
 * @param answers Object from react-hook-form. Nested structure mirrors a report page at the top level. Answer properties can appear at any depth
 * @param errors Errors object from react hook form. Same structure as above, but when an key has a nested .message ("answer"), it needs to be removed
 * @returns A filtered answers object
 */
export const filterErrors = (answers: any, errors: any) => {
  const filteredAnswers = structuredClone(answers); // set all items at this level from answers

  // This level has an error message, omit the answer attached
  if (
    errors.answer &&
    errors.answer.message &&
    (filteredAnswers.answer || filteredAnswers.answer === "")
  ) {
    // By convention, all of our answers are in an answer field
    delete filteredAnswers.answer;
  }

  // Check for nested errors
  for (let key in errors) {
    if (
      errors[key] instanceof Object &&
      filteredAnswers[key] instanceof Object
    ) {
      filteredAnswers[key] = filterErrors(filteredAnswers[key], errors[key]);
    }
  }
  return filteredAnswers;
};

export const mergeAnswers = (
  answers: any,
  state: HcbsReportState,
  errors?: any
) => {
  if (!state.report) return;
  const report = structuredClone(state.report);
  const pageIndex = state.report.pages.findIndex(
    (page) => page.id === state.currentPageId
  );

  const filteredAnswers = errors ? filterErrors(answers, errors) : answers;

  report.pages[pageIndex] = deepMerge(report.pages[pageIndex], filteredAnswers);
  return { report };
};

export const substitute = (
  report: Report,
  selectMeasure: MeasurePageTemplate
) => {
  const measures = report?.pages.filter((page) =>
    isMeasureTemplate(page)
  ) as MeasurePageTemplate[];

  const substitute = selectMeasure.substitutable?.toString();
  const measure = measures.find((measure) => measure.id.includes(substitute!));
  if (measure) {
    measure.required = true;
    selectMeasure.required = false;
  }

  return { report };
};
/**
 * Clear all nested content in the measure, preserving an In Progress state,
 * and ignoring any fields with special treatment
 */
export const clearMeasure = (
  measureId: string,
  state: HcbsReportState,
  ignoreList: string[]
) => {
  if (!state.report) return;
  const report = structuredClone(state.report);
  performClearMeasure(measureId, report, ignoreList);
  return { report };
};

/**
 * Hard reset a measure back to the Not Started state
 */
export const resetMeasure = (measureId: string, state: HcbsReportState) => {
  if (!state.report) return;
  const report = structuredClone(state.report);

  performResetMeasure(measureId, report);
  return { report };
};

/**
 * Action saving a report to the api, updates errors or saved status
 */
export const saveReport = async (state: HcbsReportState) => {
  if (!state.report) return;
  try {
    await putReport(state.report); // Submit to API
  } catch (_) {
    return { errorMessage: "Something went wrong, try again." };
  }
  return { lastSavedTime: getLocalHourMinuteTime() };
};
