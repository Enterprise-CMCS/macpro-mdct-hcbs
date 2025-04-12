/**
 * Logic pertaining to what it means to be completable, by page and report.
 */
import {
  ElementType,
  HideCondition,
  PageStatus,
  PageElement,
  RadioTemplate,
  Report,
  PerformanceRateTemplate,
} from "types";

export const pageIsCompletable = (report: Report, pageId: string) => {
  const targetPage = report.pages.find((page) => page.id === pageId);
  if (!targetPage) return false;
  if (!targetPage.elements) return true;

  for (const element of targetPage.elements) {
    const satisfied = elementSatisfiesRequired(element, targetPage.elements);
    if (!satisfied) return false;
  }

  // Check Child Pages are Complete if they allow statuses
  if (!("children" in targetPage) || !targetPage.children) return true;
  // Same logic as MeasureResultsNavigationTable
  const deliveryMethodRadio = targetPage.elements.find(
    (element) => element.id === "delivery-method-radio"
  ) as RadioTemplate;
  if (!deliveryMethodRadio) return true; // no selection to be made, no dependency
  const selections = deliveryMethodRadio?.answer ?? "";
  for (const dependentPage of targetPage.children) {
    const deliverySystemIsSelected = selections
      .split(",")
      .includes(dependentPage.key);
    const childPage = report.pages.find(
      (page) => page.id === dependentPage.template
    );
    if (
      (!deliveryMethodRadio || deliverySystemIsSelected) &&
      childPage &&
      "status" in childPage &&
      childPage.status !== PageStatus.COMPLETE
    )
      return false;
  }
  targetPage.childPageIds;

  return true;
};

export const elementSatisfiesRequired = (
  element: PageElement,
  pageElements: PageElement[]
) => {
  // TODO: make less ugly
  if (
    !("required" in element) ||
    !element.required ||
    ("hideCondition" in element &&
      elementIsHidden(element.hideCondition, pageElements))
  ) {
    return true;
  }
  if (!("answer" in element) || !element.answer) {
    // TODO: number fields are currently represented as strings, need to be handled here when fixed
    return false;
  }
  // Special handling - nested children
  if (element.type === ElementType.Radio) {
    for (const choice of element.value) {
      if (choice.value !== element.answer || !choice.checkedChildren) continue;
      for (const childElement of choice.checkedChildren) {
        const satisfied = elementSatisfiesRequired(childElement, pageElements);
        if (!satisfied) return false;
      }
    }
  }
  // Special handling - rates
  if (
    element.type === ElementType.PerformanceRate &&
    !rateIsComplete(element)
  ) {
    return false;
  }
  return true;
};

const rateIsComplete = (element: PerformanceRateTemplate) => {
  if (!element.answer) return false;
  if ("rates" in element.answer) {
    // PerformanceData
    element.answer.rates;
    for (const uniqueRate of element.answer.rates) {
      // TODO: number fields are currently represented as strings, need to be handled here when fixed
      if (!uniqueRate.rate) return false;
      // TODO: confirm this
    }
  } else {
    // RateSetData[]
    for (const rateAnswer of element.answer) {
      if (!rateAnswer.rates) return false;
      for (const uniqueRate of rateAnswer.rates) {
        // TODO: number fields are currently represented as strings, need to be handled here when fixed
        if (!uniqueRate.rate) return false;
      }
    }
  }
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
