import { qmReportTemplate } from "../../forms/qm";
import { putReport } from "../../storage/reports";
import { Report, ReportOptions, ReportType } from "../../types/reports";

const reportTemplates = {
  [ReportType.QM]: qmReportTemplate,
};

export const buildReport = async (
  reportType: ReportType,
  state: string,
  reportOptions: ReportOptions,
  username: string
) => {
  const report = structuredClone(reportTemplates[reportType]) as Report;
  // TODO: Save version to db (filled or unfilled?)

  report.state = state;
  report.id = state + reportType + ""; // TODO: uid
  report.created = Date.now();
  report.lastEdited = Date.now();
  report.lastEditedBy = username;
  report.name = reportOptions.name;

  if (reportType == ReportType.QM) {
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
      // TODO: let the parent know what it relates to
      return page;
    });

    report.pages = report.pages.concat(measurePages);
  }

  // Save
  await putReport(report);
  return report;
};
