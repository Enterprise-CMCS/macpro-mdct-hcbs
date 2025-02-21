import { MeasureStatus, PageElement, ElementType, Report } from "types";

/**
 * Clear all nested content in the measure, preserving an In Progress state,
 * and ignoring any fields with special treatment
 */
export const performClearMeasure = (
  measureId: string,
  report: Report,
  ignoreList: string[]
) => {
  const page = report.pages.find((page) => page.id === measureId);
  if (!page) {
    return;
  }
  if ("status" in page) {
    page.status = MeasureStatus.IN_PROGRESS;
  }
  // Clean measure
  page.elements?.forEach((element) => {
    if (ignoreList.includes(element.id)) {
      return;
    }
    performResetPageElement(element);
  });
  // TODO: Clear children measures

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
    // hmm
    page.status = MeasureStatus.NOT_STARTED;
  }

  // Clean measure
  page.elements?.forEach((element) => {
    performResetPageElement(element);
  });

  // TODO: Clear children measures

  return { report };
};

/**
 * Resets an element back to a pristine state, useful for more complex types
 */
const performResetPageElement = (element: PageElement) => {
  if ("answer" in element) {
    element.answer = undefined;
  }
  if (element.type == ElementType.Radio) {
    for (const choice of element.value) {
      if (!choice.checkedChildren) continue;
      for (const childElement of choice.checkedChildren) {
        performResetPageElement(childElement);
      }
    }
  }
};
