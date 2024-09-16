import { qmTemplate } from "../../forms/qmTemplate";
import { putReport } from "../../storage/reports";
import { Report } from "../../types/reports";
import { ReportType } from "../../utils/constants";

export const repoortTemplates = {
  [ReportType.QM]: qmTemplate,
};

export const buildReport = async (
  reportType: ReportType,
  state: string,
  measureOptions: string[],
  username: string
) => {
  const report = structuredClone(repoortTemplates[reportType]) as Report;
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

    // TODO: Sort measures into appropriate sections
  }

  // Save
  await putReport(report);
  return report;
};
