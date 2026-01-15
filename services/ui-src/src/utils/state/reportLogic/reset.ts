/**
 * Logic for what it means to reset or clear a report.
 * Clearing is referred to here as a soft reset of page, and reset is a full wipe of progress.
 */
import {
  PageStatus,
  PageElement,
  ElementType,
  Report,
  PageType,
  MeasurePageTemplate,
} from "types";

/**
 * Clear all nested content in the measure, preserving an In Progress state,
 * and ignoring any fields with special treatment
 */
export const performClearMeasure = (
  measureId: string,
  report: Report,
  ignoreList: { [key: string]: string }
) => {
  const page = report.pages.find((page) => page.id === measureId);
  if (!page) {
    return;
  }
  if ("status" in page) {
    page.status = PageStatus.IN_PROGRESS;
  }
  // Clean measure
  for (let element of page.elements ?? []) {
    if (element.id in ignoreList) {
      // Ignore typeguards for now; the answer may not be set yet.
      const elementWithAnswer = element as { answer: any };
      elementWithAnswer.answer = ignoreList[element.id];
      continue;
    }
    performResetPageElement(element);
  }

  // Clear children of measures - hard reset
  if (page.type === PageType.Measure) {
    (page as MeasurePageTemplate).dependentPages?.forEach((child) => {
      performResetMeasure(child.template, report);
    });
  }

  return { report };
};

/**
 * Hard reset a measure back to the Not Started state
 */
export const performResetMeasure = (measureId: string, report: Report) => {
  const page = report.pages.find((page) => page.id === measureId);
  if (!page) {
    return;
  }
  if ("status" in page) {
    page.status = PageStatus.NOT_STARTED;
  }

  // Clean measure
  page.elements?.forEach((element) => {
    performResetPageElement(element);
  });

  // Clear children of measures
  if (page.type === PageType.Measure) {
    (page as MeasurePageTemplate).dependentPages?.forEach((child) => {
      performResetMeasure(child.template, report);
    });
  }
  return { report };
};

/**
 * This function handles edge cases where the answer is not undefined in the default form report
 * For waivers-list-checkboxes, we mark all checkboxes as checked in buildReport.ts by default per request from the BOs for all states.
 * Therefore when we reset, we have to reset it to being checked which means the answer cannot be undefined.
 */
const resetAnswerBySpecificId = (element: PageElement) => {
  if (
    element.type == ElementType.Checkbox &&
    element.id === "waivers-list-checkboxes"
  ) {
    return element.choices.map((choice) => choice.value);
  }

  return undefined;
};
/**
 * Resets an element back to a pristine state, useful for more complex types
 */
const performResetPageElement = (element: PageElement) => {
  if ("answer" in element) {
    element.answer = resetAnswerBySpecificId(element);
  }
  if (element.type == ElementType.Radio) {
    for (const choice of element.choices) {
      if (!choice.checkedChildren) continue;
      for (const childElement of choice.checkedChildren) {
        performResetPageElement(childElement);
      }
    }
  }
};
