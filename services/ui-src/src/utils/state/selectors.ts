import { ElementType, HcbsReportState, PageElement, Report } from "types";

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
  return isCompletable(state.report, state.currentPageId);
};

const isCompletable = (report: Report, pageId: string) => {
  const targetPage = report.pages.find((page) => page.id === pageId);
  if (!targetPage) return false;
  if (!targetPage.elements) return true;

  // TODO: check questions on page
  for (const element of targetPage.elements) {
    const satisfied = elementSatisfiesRequired(element, targetPage.elements);
    if (!satisfied) return false;
  }

  // TODO: check children pages
  return true;
};

const elementSatisfiesRequired = (
  element: PageElement,
  pageElements: PageElement[]
) => {
  // TODO: make less ugly
  if (!("required" in element) || !element.required) return true;
  if ("hideCondition" in element) {
    // TODO something is weird here
    const controlElement = pageElements.find((target: any) => {
      return target?.id === element.hideCondition?.controllerElementId;
    });
    if (
      controlElement &&
      "answer" in controlElement &&
      controlElement.answer === element.hideCondition?.answer
    ) {
      // Item is hidden
      return true;
    }
  }
  if (!("answer" in element) || !element.answer || element.answer.length == 0)
    return false;
  // TODO: number fields

  if (element.type == ElementType.Radio) {
    for (const choice of element.value) {
      if (choice.value !== element.answer || !choice.checkedChildren) continue;
      for (const childElement of choice.checkedChildren) {
        const satisfied = elementSatisfiesRequired(childElement, pageElements);
        if (!satisfied) return false;
      }
    }
  }
  // TODO: Rates
  return true;
};
