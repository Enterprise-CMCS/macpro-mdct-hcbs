import { assertExhaustive, ReportType } from "../types/reports";
import { xyzReportTemplate as xyzReportTemplate2026 } from "./2026/xyz/xyz";

const formsByYear = {
  2026: {
    xyzReportTemplate: xyzReportTemplate2026,
  },
};

function assertYearIsValid(
  year: number
): asserts year is keyof typeof formsByYear {
  if (year in formsByYear) {
    return;
  } else {
    throw new Error(
      `Invalid year - form templates for ${year} are not implemented`
    );
  }
}

export const getReportTemplate = (reportType: ReportType, year: number) => {
  assertYearIsValid(year);
  switch (reportType) {
    case ReportType.XYZ:
      return formsByYear[year].xyzReportTemplate;
    default:
      assertExhaustive(reportType);
      throw new Error(
        `Not implemented - getReportTemplate for ReportType ${reportType}`
      );
  }
};
