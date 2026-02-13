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
  MeasurePageTemplate,
  isFormPageTemplate,
  isMeasurePageTemplate,
  LengthOfStayFieldNames,
  assertExhaustive,
  ReadmissionRateFieldNames,
} from "types";

/**
 * Calculate the status of any page, including calculated values.
 * Special consideration for pages that calculate their display-only status based off many pages.
 * Returns an implied status for pages like the general page that don't have a manual click.
 * @param report
 * @param pageId
 * @returns
 */
export const inferredReportStatus = (report: Report, pageId: string) => {
  // Manual signoff pages
  const targetPage = report.pages.find((page) => page.id === pageId);
  if (!targetPage) return;
  if (isFormPageTemplate(targetPage) && targetPage.status)
    return targetPage.status;

  // Calculated Pages with rollups
  if (pageId === "req-measure-result") return requiredRollupPageStatus(report);
  if (pageId === "optional-measure-result")
    return optionalRollupPageStatus(report);

  // inferred pages
  if (pageIsCompletable(report, pageId)) return PageStatus.COMPLETE;
  return pageInProgress(report, pageId)
    ? PageStatus.IN_PROGRESS
    : PageStatus.NOT_STARTED;
};

// Check to see if a page has been dirtied if it is not keeping a signoff status
export const pageInProgress = (report: Report, pageId: string) => {
  const targetPage = report.pages.find((page) => page.id === pageId);
  if (!targetPage) return false;
  if (!targetPage.elements) return true;

  const hasData = (answerPart: string | number | object | undefined) => {
    if (answerPart === undefined || answerPart === null) {
      // null and undefined are not data
      return false;
    } else if (typeof answerPart === "number") {
      // Zero would be considered data, as would any other number
      return true;
    } else if (typeof answerPart === "string") {
      // An empty string would not be data, but any other string would be.
      return answerPart !== "";
    } else if (Array.isArray(answerPart)) {
      // An array only has data if some element of the array is data.
      return answerPart.some(hasData);
    } else if (typeof answerPart === "object") {
      // An object only has data if one of its properties is data.
      return Object.values(answerPart).some(hasData);
    } else {
      // It shouldn't be possible to reach this code branch.
      assertExhaustive(answerPart);
      // But if some value somehow does make it here, let's call it data.
      return true;
    }
  };

  const anyEdited = targetPage.elements.find(
    (element) => "answer" in element && hasData(element.answer)
  );
  return !!anyEdited;
};

/**
 * Returns whether a given page can be considered completable.
 * In QMS for a measure or measure details page, this means the status can be marked "complete".
 * For elements without a status this means they can be considered complete enough to submit, such as General Info.
 * @param report
 * @param pageId
 * @returns Completable status.
 */
export const pageIsCompletable = (report: Report, pageId: string) => {
  const targetPage = report.pages.find((page) => page.id === pageId);
  if (!targetPage) return false;
  if (!targetPage.elements) return true;

  for (const element of targetPage.elements) {
    const satisfied = elementSatisfiesRequired(element, targetPage.elements);
    if (!satisfied) return false;
  }

  // Check Child Pages are Complete if they allow statuses
  if (!isMeasurePageTemplate(targetPage) || !targetPage.dependentPages)
    return true;
  // Same logic as MeasureResultsNavigationTable
  const deliveryMethodRadio = targetPage.elements.find(
    (element) => element.id === "delivery-method-radio"
  ) as RadioTemplate;

  const selections = deliveryMethodRadio?.answer ?? "";
  for (const dependentPage of targetPage.dependentPages) {
    const deliverySystemIsSelected = selections
      .split(",")
      .includes(dependentPage.key);
    const childPage = report.pages.find(
      (page) => page.id === dependentPage.template
    );
    if (
      (!deliveryMethodRadio || deliverySystemIsSelected) &&
      childPage &&
      isFormPageTemplate(childPage) &&
      childPage.status !== PageStatus.COMPLETE
    )
      return false;
  }
  return true;
};

// Return complete if all complete, in progress if at least one in progress, else not started
const requiredRollupPageStatus = (report: Report) => {
  const requiredMeasures = report.pages.filter(
    (page) => isMeasurePageTemplate(page) && page.required
  ) as MeasurePageTemplate[];

  if (
    requiredMeasures.every((measure) => measure.status === PageStatus.COMPLETE)
  )
    return PageStatus.COMPLETE;
  if (
    requiredMeasures.find(
      (measure) =>
        measure.status &&
        [PageStatus.COMPLETE, PageStatus.IN_PROGRESS].includes(
          measure.status || ""
        )
    )
  )
    return PageStatus.IN_PROGRESS;
  return PageStatus.NOT_STARTED;
};

// Return in progress if any in flight, then complete if any complete, not started otherwise
const optionalRollupPageStatus = (report: Report) => {
  const requiredMeasures = report.pages.filter(
    (page) => isMeasurePageTemplate(page) && !page.required
  );
  let status = PageStatus.NOT_STARTED;
  for (const measure of requiredMeasures as MeasurePageTemplate[]) {
    if (measure.status === PageStatus.IN_PROGRESS)
      return PageStatus.IN_PROGRESS;
    if (measure.status === PageStatus.COMPLETE) status = PageStatus.COMPLETE;
  }
  return status;
};

export const elementSatisfiesRequired = (
  element: PageElement,
  pageElements: PageElement[]
) => {
  //while list input is not required, if the user adds a field and leaves it blank, that would make it incomplete and prevent form submission
  if (element.type === ElementType.ListInput) {
    if (element.answer?.some((item) => item === "" || item === undefined)) {
      return false;
    }
  }

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
    for (const choice of element.choices) {
      if (choice.value !== element.answer || !choice.checkedChildren) continue;
      for (const childElement of choice.checkedChildren) {
        const satisfied = elementSatisfiesRequired(childElement, pageElements);
        if (!satisfied) return false;
      }
    }
  }

  if (element.type === ElementType.Checkbox) {
    for (const choice of element.choices) {
      if (!element.answer?.includes(choice.value) || !choice.checkedChildren) {
        continue;
      }
      for (const childElement of choice.checkedChildren) {
        const satisfied = elementSatisfiesRequired(childElement, pageElements);
        if (!satisfied) return false;
      }
    }
  }

  if (element.type === ElementType.LengthOfStayRate) {
    if (element.errors && element.errors.populationRate) return false;
    return Object.values(LengthOfStayFieldNames)
      .filter((fieldId) => fieldId !== "populationRate") // populationRate is not required
      .every((fieldId) => element.answer?.[fieldId] !== undefined);
  }
  if (element.type === ElementType.ReadmissionRate) {
    if (element.errors) {
      const hasErrors = Object.values(element.errors).some(
        (error) => error !== undefined && error !== ""
      );
      if (hasErrors) return false;
    }
    return Object.values(ReadmissionRateFieldNames).every(
      (fieldId) => element.answer?.[fieldId] !== undefined
    );
  }
  if (element.type === ElementType.NdrFields) {
    return element.answer.every((assessObj) => {
      if (assessObj.denominator === undefined) return false;
      return assessObj.rates.every((rateObj) => {
        if (rateObj.numerator === undefined) return false;
        if (rateObj.rate === undefined) return false;
        return true;
      });
    });
  }
  if (element.type === ElementType.NdrEnhanced) {
    if (element.answer.denominator === undefined) return false;
    return element.answer.rates.every((rateObj) => {
      if (rateObj.numerator === undefined) return false;
      if (rateObj.rate === undefined) return false;
      return true;
    });
  }
  if (element.type === ElementType.Ndr) {
    if (element.answer.numerator === undefined) return false;
    if (element.answer.denominator === undefined) return false;
    if (element.answer.rate === undefined) return false;
  }

  if (element.type === ElementType.NdrBasic) {
    if (element.answer.numerator === undefined) return false;
    if (element.answer.denominator === undefined) return false;
    if (element.answer.rate === undefined) return false;

    //For forms like PCP-1 & PCP-2, they have conditional children rendered based on if performance level has been reached.
    if (
      element.minPerformanceLevel &&
      element.answer.rate < element.minPerformanceLevel
    ) {
      if (
        element.conditionalChildren &&
        !element.conditionalChildren
          .filter((child) => "required" in child)
          .every((child) => "answer" in child && child.answer != undefined)
      )
        return false;
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
    !!controlElement &&
    "answer" in controlElement &&
    controlElement.answer === hideCondition?.answer
  );
};
