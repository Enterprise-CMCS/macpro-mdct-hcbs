/**
 * Logic pertaining to what it means to be completable, by page and report.
 */
import { ElementType, HideCondition, PageElement, Report } from "types";

export const isCompletable = (report: Report, pageId: string) => {
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

export const elementSatisfiesRequired = (
  element: PageElement,
  pageElements: PageElement[]
) => {
  // TODO: make less ugly
  if (!("required" in element) || !element.required) return true;
  if ("hideCondition" in element) {
    if (elementIsHidden(element.hideCondition, pageElements)) return true;
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

export const elementIsHidden = (
  hideCondition: HideCondition | undefined,
  elements: Partial<PageElement>[]
) => {
  if (!hideCondition) return false;

  const controlElement = elements.find((target: any) => {
    return target?.id === hideCondition?.controllerElementId;
  });
  return (
    controlElement &&
    "answer" in controlElement &&
    controlElement.answer === hideCondition?.answer
  );
};
