import KSUID from "ksuid";
import {
  getReportTemplate,
  getCmitInfo,
} from "../../forms/yearlyFormSelection";
import {
  Report,
  ReportStatus,
  ReportOptions,
  ReportType,
  isHeaderTemplate,
  MeasureOptions,
  MeasurePageTemplate,
  CMIT,
  PageStatus,
} from "../../types/reports";
import { User } from "../../types/types";
import { validateReportPayload } from "../../utils/reportValidation";
import { logger } from "../../libs/debug-lib";

export const buildReport = async (
  reportType: ReportType,
  state: string,
  reportOptions: ReportOptions,
  user: User
) => {
  const year = reportOptions.year;
  const template = getReportTemplate(reportType, year);
  const cmitList = getCmitInfo(year);

  const report: Report = {
    state: state,
    id: KSUID.randomSync().string,
    created: Date.now(),
    lastEdited: Date.now(),
    lastEditedBy: user.fullName,
    lastEditedByEmail: user.email,
    type: reportType,
    status: ReportStatus.NOT_STARTED,
    name: reportOptions.name,
    year: reportOptions.year,
    options: reportOptions.options,
    archived: false,
    submissionCount: 0,
    pages: structuredClone(template.pages),
  };

  if (reportType == ReportType.QMS) {
    // Collect all measures, based on selected rules.
    let measures = template.measureLookup.defaultMeasures;
    if (report.options.pom) {
      measures.push(...template.measureLookup.pomMeasures);
    }

    for (let measure of measures) {
      const cmitInfo = cmitList.find((cmit) => cmit.uid === measure.uid)!;
      const parentPage = initializeQmsPage(
        measure,
        template.measureTemplates[measure.measureTemplate],
        cmitInfo,
        true
      );

      const childPages = measure.dependentPages.map((pageInfo) =>
        initializeQmsPage(
          measure,
          template.measureTemplates[pageInfo.template],
          cmitInfo,
          false
        )
      );
      report.pages.push(parentPage, ...childPages);
    }
  }

  /**
   * Report should always be valid in this function, but we're going
   * to send it through the report validator for a sanity check
   */
  let validatedReport: Report | undefined;
  try {
    validatedReport = await validateReportPayload(report);
  } catch (err) {
    logger.error(err);
    throw new Error("Invalid request");
  }

  return validatedReport;
};

/**
 * Clone the given template, and fill it in with the necessary data.
 */
const initializeQmsPage = (
  measure: MeasureOptions,
  template: MeasurePageTemplate,
  cmitInfo: CMIT,
  isMeasurePage: boolean
) => {
  const page = structuredClone(template);
  page.cmit = measure.cmit;
  page.cmitId = measure.uid;
  page.stratified = measure.stratified;
  page.required = measure.required;
  page.status = PageStatus.NOT_STARTED;

  if (isMeasurePage) {
    page.dependentPages = measure.dependentPages;
    page.cmitInfo = cmitInfo;
  }

  for (let i = 0; i < page.elements.length; i += 1) {
    let element = page.elements[i];
    if (isHeaderTemplate(element)) {
      /*
       * Many pages share the same `measureHeader` object, from elements.ts
       * The extra clone ensures we only alter this page's header.
       */
      const clone = structuredClone(element);
      clone.text = clone.text.replace("{measureName}", cmitInfo.name);
      page.elements[i] = clone;
    }
  }
  return page;
};
