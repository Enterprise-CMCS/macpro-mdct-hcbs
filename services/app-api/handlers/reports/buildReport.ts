import { qmReportTemplate } from "../../forms/qm";
import { putReport } from "../../storage/reports";
import { Report, ReportType } from "../../types/reports";

const reportTemplates = {
  [ReportType.QM]: qmReportTemplate,
};

export const buildReport = async (
  reportType: ReportType,
  state: string,
  measureOptions: string[],
  username: string
) => {
  const report = structuredClone(reportTemplates[reportType]) as Report;
  // TODO: Save version to db (filled or unfilled?)

  report.state = state;
  report.id = state + reportType + ""; // TODO: uid
  report.created = Date.now();
  report.lastEdited = Date.now();
  report.lastEditedBy = username;

  if (reportType == ReportType.QM) {
    // Collect all measures
    const measures = [...report.measureLookup.defaultMeasures];
    const matchingRules = Object.entries(report.measureLookup.optionGroups)
      .filter(([k, _]) => measureOptions.includes(k))
      .flatMap((arr) => arr[1]);
    measures.push(...matchingRules);

    for (const measure of measures) {
      // TODO: make reusable. This will be used on the optional page when adding a measure.
      const page = structuredClone(
        report.measureTemplates[measure.measureTemplate]
      );
      page.cmit = measure.cmit;
      page.id += measure.cmit; // TODO this will need some logic if a measure is substituted
      page.stratified = measure.stratified;
      page.required = measure.required;
      // TODO: let the parent know what it relates to

      report.pages.push(page);
    }
  }

  // Save
  await putReport(report);
  return report;
};
