import { logger } from "../../libs/debug-lib";
import { handler } from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, forbidden, ok, notFound } from "../../libs/response-lib";
import { getReport, putReport } from "../../storage/reports";
import {
  ElementType,
  FormPageTemplate,
  LengthOfStayField,
  MeasureTargetInfo,
  MeasureTargetMapping,
  NumberFieldTemplate,
  PageElement,
  ReadmissionRateField,
  Report,
  ReportStatus,
  ReportType,
} from "../../types/reports";
import { canWriteState } from "../../utils/authorization";
import { error } from "../../utils/constants";

export const patchReport = handler(parseReportParameters, async (request) => {
  const { reportType, state, id } = request.parameters;
  const user = request.user;

  if (!canWriteState(user, state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  if (!request?.body || !("patchType" in request.body)) {
    return badRequest("Invalid request");
  }

  const report = await getReport(reportType, state, id);
  if (!report) return notFound();
  if (
    reportType !== report.type ||
    state !== report.state ||
    id !== report.id ||
    report.status === ReportStatus.SUBMITTED
  ) {
    return badRequest("Invalid request");
  }

  switch (request.body.patchType) {
    case "addQipTargetPage":
      return addQipTargetPage(report, request.body);
    default:
      return badRequest("Unrecognized patch type");
  }
});

const addQipTargetPage = async (report: Report, targetInfo: unknown) => {
  if (report.type !== ReportType.QIP) {
    return badRequest("Report type must be QIP");
  }
  if (!isMeasureTargetInfo(targetInfo)) {
    return badRequest("Invalid request body");
  }
  const targetMapping = findTargetMapping(report, targetInfo);
  if (!targetMapping) {
    return badRequest("Request body contains an incorrect ID");
  }

  const pages = report.pages;
  const templatePageIndex = pages.findIndex(
    (p) => p.id === "measure-target-template"
  );
  const templatePage = pages[templatePageIndex];
  const newPage = structuredClone(templatePage) as FormPageTemplate;
  const [pageHeaderIdx, baselineHeaderIdx, targetHeaderIdx] = [
    "page-header",
    "baseline-{deliveryMethodId}-header",
    "target-{deliveryMethodId}-header",
  ].map((id) => newPage.elements.findIndex((el) => id === el.id));

  let uniqueId = `measure-targets-${targetInfo.measureId}-0`;
  while (report.pages.some((p) => p.id === uniqueId)) {
    // If there is already a target page for this measure, increment the suffix.
    const suffix = parseInt(uniqueId.split("-").at(-1)!);
    uniqueId = uniqueId.replace(/-\d+$/, "-" + (suffix + 1).toString());
  }
  newPage.id = uniqueId;

  /** Running list of which string variables can be replaced in the templates */
  const variables: Record<string, string> = {
    measureName: targetMapping.measureName,
  };
  const populateVariables = (obj: object, key: string) => {
    for (let [name, value] of Object.entries(variables)) {
      (obj as any)[key] = (obj as any)[key].replace("{" + name + "}", value);
    }
  };
  populateVariables(newPage, "navTitle");
  populateVariables(newPage, "tabTitle");
  populateVariables(newPage.elements[pageHeaderIdx], "text");

  const populateRateSection = (sectionHeaderIndex: number) => {
    const sectionElements: PageElement[] = [];
    const headerTemplate = newPage.elements[sectionHeaderIndex];
    const rateTemplate = newPage.elements[sectionHeaderIndex + 1];

    for (const deliveryMethodId of targetInfo.deliveryMethods) {
      variables.deliveryMethodId = deliveryMethodId;
      variables.deliveryMethodLabel = deliveryMethodLabels[deliveryMethodId];

      const header = structuredClone(headerTemplate);
      populateVariables(header, "id");
      populateVariables(header, "text");
      sectionElements.push(header);

      for (const rateId of targetInfo.rates) {
        const rateInfo = targetMapping.rates.find((r) => r.id === rateId)!;
        variables.rateId = rateId;
        variables.rateLabel = rateInfo.label;

        const rate = structuredClone(rateTemplate);
        populateVariables(rate, "id");
        populateVariables(rate, "label");
        sectionElements.push(rate);
      }
    }
    return sectionElements;
  };

  // Insert the new sections in place of their template elements
  newPage.elements = [
    ...newPage.elements.slice(0, baselineHeaderIdx),
    ...populateRateSection(baselineHeaderIdx),
    ...newPage.elements.slice(baselineHeaderIdx + 2, targetHeaderIdx),
    ...populateRateSection(targetHeaderIdx),
    ...newPage.elements.slice(targetHeaderIdx + 2),
  ];

  let originalValues: Record<string, number> = {};
  if (targetInfo.qmsReportId) {
    if (!targetMapping.includedInQms) {
      return badRequest(
        `Cannot copy baseline values: ${targetInfo.measureId} is not a QMS measure.`
      );
    }
    let qmsReport = await getReport(
      ReportType.QMS,
      report.state,
      targetInfo.qmsReportId
    );
    if (!qmsReport) {
      return notFound(
        `Cannot copy baseline values: QMS Report ${targetInfo.qmsReportId} does not exist.`
      );
    }
    originalValues = fillBaselineValues(
      targetInfo,
      targetMapping,
      qmsReport,
      newPage
    );
  }

  // Insert the new page just in front of the template page
  report.pages = [
    ...pages.slice(0, templatePageIndex),
    newPage,
    ...pages.slice(templatePageIndex),
  ];

  await putReport(report);

  return ok({
    report,
    pageId: newPage.id,
    originalValues,
  });
};

export const deliveryMethodLabels: Record<string, string> = {
  FFS: "Fee For Service",
  MLTSS: "Managed Care",
};

const isMeasureTargetInfo = (info: unknown): info is MeasureTargetInfo => {
  if (!info || typeof info !== "object") {
    return false;
  }

  if (
    !("measureId" in info) ||
    !info.measureId ||
    typeof info.measureId !== "string"
  ) {
    logger.warn("measureId must be a string");
    return false;
  }

  if ("qmsReportId" in info && typeof info.qmsReportId !== "string") {
    logger.warn("qmsReportId, if present, must be a string");
    return false;
  }

  if (
    !("deliveryMethods" in info) ||
    !Array.isArray(info.deliveryMethods) ||
    !info.deliveryMethods.every((dm) => Boolean(dm) && typeof dm === "string")
  ) {
    logger.warn("deliveryMethods must be a string array");
    return false;
  }

  if (
    !("rates" in info) ||
    !Array.isArray(info.rates) ||
    !info.rates.every((r) => Boolean(r) || typeof r === "string")
  ) {
    logger.warn("rates must be a string array");
    return false;
  }

  return true;
};

/**
 * Search the for the measure target mapping which contains all the needed data.
 * Returns undefined if it can't be found, or if any IDs do not match.
 */
const findTargetMapping = (report: Report, info: MeasureTargetInfo) => {
  const mapping = report.measureTargetMapping?.find(
    (mtm) => mtm.measureId === info.measureId
  );
  if (!mapping) {
    logger.warn("invalid measureId");
    return undefined;
  }

  for (let deliveryMethodId of info.deliveryMethods) {
    if (!(deliveryMethodId in mapping.deliveryMethods)) {
      logger.warn("invalid deliveryMethodId");
      return undefined;
    }
  }

  for (let rateId of info.rates) {
    if (!mapping.rates.some((rate) => rate.id === rateId)) {
      logger.warn("invalid rateId");
      return undefined;
    }
  }

  return mapping;
};

const fillBaselineValues = (
  targetInfo: MeasureTargetInfo,
  targetMapping: Extract<MeasureTargetMapping[number], { includedInQms: true }>,
  qmsReport: Report,
  newPage: FormPageTemplate
) => {
  const originalValues: Record<string, number> = {};
  for (let deliveryMethodId of targetInfo.deliveryMethods) {
    const pageId = targetMapping.deliveryMethods[deliveryMethodId].qmsPageId;
    const qmsPage = qmsReport.pages.find((p) => p.id === pageId)!;
    for (let rateId of targetInfo.rates) {
      const rateMapping = targetMapping.rates.find((r) => r.id === rateId)!;
      const elemId = rateMapping.qmsElementId;
      // Note: This does not recurse into radio/checkbox checkedChildren,
      // because (at time of writing) none of the copyable values appear there.
      // If we ever need to copy the answer of a nested question, change this.
      const qmsElement = qmsPage.elements!.find((el) => el.id === elemId)!;
      const value = getQmsElementValue(qmsElement, rateId);
      if (value === undefined) {
        console.warn(
          `Cannot copy answer. QMS report ${targetInfo.qmsReportId}, page ${pageId}, element ${elemId}, rate ${rateId}.`
        );
        continue;
      }
      const qipElement = newPage.elements.find(
        (el) => el.id === `baseline-${deliveryMethodId}-${rateId}`
      ) as NumberFieldTemplate;
      qipElement.answer = value;
      originalValues[`${deliveryMethodId}-${rateId}`] = value;
    }
  }
  return originalValues;
};

const getQmsElementValue = (qmsElement: PageElement, rateId: string) => {
  if ("answer" in qmsElement && typeof qmsElement.answer === "number") {
    return qmsElement.answer;
  }
  switch (qmsElement.type) {
    case ElementType.LengthOfStayRate:
      return qmsElement.answer?.[rateId as LengthOfStayField];
    case ElementType.MultiCategoryNdr:
      return qmsElement.answer
        ?.flatMap((cat) => cat.rates)
        .find((r) => r.id === rateId)?.rate;
    case ElementType.MultiRateNdr:
      return qmsElement.answer?.rates.find((r) => r.id === rateId)?.rate;
    case ElementType.Ndr:
    case ElementType.PerformanceNdr:
      return qmsElement.answer?.rate;
    case ElementType.ReadmissionRate:
      return qmsElement.answer?.[rateId as ReadmissionRateField];
    // Note: This accounts for all current element types with copyable values,
    // but if we add a new element type to QMS, we may need to add a case here.
  }
};
