import { assertExhaustive, ReportType } from "../types/reports";
import { CMIT_LIST as CMIT_LIST_2026 } from "./2026/cmit";
import { qmsReportTemplate as qmsReportTemplate2026 } from "./2026/qms";

const formsByYear = {
  2026: {
    CMIT_LIST: CMIT_LIST_2026,
    qmsReportTemplate: qmsReportTemplate2026,
    taReportTemplate: undefined,
    ciReportTemplate: undefined,
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

export const getCmitInfo = (year: number) => {
  assertYearIsValid(year);
  return formsByYear[year].CMIT_LIST;
};

export const getReportTemplate = (reportType: ReportType, year: number) => {
  assertYearIsValid(year);
  switch (reportType) {
    case ReportType.QMS:
      return formsByYear[year].qmsReportTemplate;
    case ReportType.TA:
    case ReportType.CI:
      throw new Error("Reports not yet available");
    default:
      assertExhaustive(reportType);
      throw new Error(
        `Not implemented - getReportTemplate for ReportType ${reportType}`
      );
  }
};
