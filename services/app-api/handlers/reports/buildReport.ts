import KSUID from "ksuid";
import {
  getReportTemplate,
  getCmitInfo,
} from "../../forms/yearlyFormSelection";
import { putReport } from "../../storage/reports";
import {
  Report,
  ReportStatus,
  ReportOptions,
  ReportType,
  isHeaderTemplate,
  MeasureOptions,
  MeasurePageTemplate,
  CMIT,
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
  const report = structuredClone(getReportTemplate(reportType, year));
  const cmitList = getCmitInfo(year);
  report.state = state;
  report.id = KSUID.randomSync().string;
  report.created = Date.now();
  report.lastEdited = Date.now();
  report.lastEditedBy = user.fullName;
  report.lastEditedByEmail = user.email;
  report.type = reportType;
  report.status = ReportStatus.NOT_STARTED;
  report.name = reportOptions.name;
  report.year = reportOptions.year;
  report.options = reportOptions.options;

  if (reportType == ReportType.QMS) {
    /*
     * Collect all measures, based on selected rules.
     * TODO is measure order important? May need to sort.
     * TODO could a measure be included by multiple rules? May need to deduplicate.
     */

    let measures = report.measureLookup.defaultMeasures;
    if (report.options.pom) {
      measures.push(...report.measureLookup.pomMeasures);
    }

    for (let measure of measures) {
      const cmitInfo = cmitList.find((cmit) => cmit.uid === measure.uid)!;
      const pages = measure.measureTemplate.map((templateName) =>
        reifyQmsPage(measure, report.measureTemplates[templateName], cmitInfo)
      );
      report.pages.push(...pages);
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

  // Save
  await putReport(validatedReport);
  return report;
};

/**
 * Clone the given template, and fill it in with the necessary data.
 */
const reifyQmsPage = (
  measure: MeasureOptions,
  template: MeasurePageTemplate,
  cmitInfo: CMIT
) => {
  const page = structuredClone(template);
  page.cmit = measure.cmit;
  page.cmitId = measure.uid;
  page.stratified = measure.stratified;
  page.required = measure.required;
  for (let header of page.elements.filter(isHeaderTemplate)) {
    header.text.replace("{measureName}", cmitInfo.name);
  }
  return page;
};
