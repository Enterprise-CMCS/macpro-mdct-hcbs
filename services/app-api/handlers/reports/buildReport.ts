import KSUID from "ksuid";
import { qmsReportTemplate } from "../../forms/qms";
import { putReport } from "../../storage/reports";
import {
  ElementType,
  PageElement,
  Report,
  ReportStatus,
  ReportOptions,
  ReportType,
} from "../../types/reports";
import { User } from "../../types/types";
import { CMIT_LIST } from "../../forms/cmit";

const reportTemplates = {
  [ReportType.QMS]: qmsReportTemplate,
};

export const buildReport = async (
  reportType: ReportType,
  state: string,
  reportOptions: ReportOptions,
  user: User
) => {
  const report = structuredClone(reportTemplates[reportType]) as Report;
  // TODO: Get version by year
  if (reportOptions.year != 2026) {
    throw new Error("ERROR: Year should be 2026");
  }
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
  report.options = {
    cahps: reportOptions.cahps,
    hciidd: reportOptions.hciidd,
    nciad: reportOptions.nciad,
    pom: reportOptions.pom,
  };

  if (reportType == ReportType.QMS) {
    /*
     * Collect all measures, based on selected rules.
     * TODO is measure order important? May need to sort.
     * TODO could a measure be included by multiple rules? May need to deduplicate.
     */
    const measures = report.measureLookup.defaultMeasures;

    const measurePages = measures.map((measure) => {
      // TODO: make reusable. This will be used on the optional page when adding a measure.
      const page = structuredClone(
        report.measureTemplates[measure.measureTemplate]
      );
      page.cmit = measure.cmit;
      page.id += measure.cmit; // TODO this will need some logic if a measure is substituted
      page.stratified = measure.stratified;
      page.required = measure.required;
      page.elements = [
        ...page.elements.map((element) =>
          findAndReplace(element, measure.cmit)
        ),
      ];
      // TODO: let the parent know what it relates to
      return page;
    });

    report.pages = report.pages.concat(measurePages);
  }

  // Save
  await putReport(report);
  return report;
};

export const findAndReplace = (element: PageElement, cmit: number) => {
  const cmitInfo = CMIT_LIST.find((list) => list.cmit === cmit);
  if (cmitInfo) {
    if (element.type === ElementType.Header) {
      element.text = element.text.replace("{measureName}", cmitInfo.name);
    }
  }
  return element;
};
