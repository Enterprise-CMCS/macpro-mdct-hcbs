import { assertExhaustive, ReportType } from "../types/reports";
import { ciReportTemplate as ciReportTemplate2026 } from "./2026/ci/ci";
import { CMIT_LIST as CMIT_LIST_2026 } from "./2026/cmit";
import { qmsReportTemplate as qmsReportTemplate2026 } from "./2026/qms/qms";
import { tacmReportTemplate as tacmReportTemplate2026 } from "./2026/tacm/tacm";

const formsByYear = {
  2026: {
    CMIT_LIST: CMIT_LIST_2026,
    qmsReportTemplate: qmsReportTemplate2026,
    tacmReportTemplate: tacmReportTemplate2026,
    ciReportTemplate: ciReportTemplate2026,
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
    case ReportType.TACM:
      return formsByYear[year].tacmReportTemplate;
    case ReportType.CI:
      return formsByYear[year].ciReportTemplate;
    default:
      assertExhaustive(reportType);
      throw new Error(
        `Not implemented - getReportTemplate for ReportType ${reportType}`
      );
  }
};
