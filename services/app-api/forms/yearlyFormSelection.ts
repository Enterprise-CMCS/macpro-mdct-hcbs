import { assertExhaustive, Report, ReportType } from "../types/reports";
import { CMIT_LIST as CMIT_LIST_2026 } from "./2026/cmit";
import { qmsReportTemplate as qmsReportTemplate2026 } from "./2026/qms";

const formsByYear = {
  2026: {
    CMIT_LIST: CMIT_LIST_2026,
    qmsReportTemplate: qmsReportTemplate2026,
  },
};

const findClosestYear = (requestedYear: number) => {
  if (requestedYear in formsByYear) {
    return requestedYear as keyof typeof formsByYear;
  }
  const allYears = Object.keys(formsByYear)
    .map((year) => Number(year) as keyof typeof formsByYear)
    .sort((a, b) => a - b);
  const minYear = allYears[0];
  if (requestedYear < minYear) {
    return minYear;
  }
  const priorYears = allYears.filter((year) => year < requestedYear);
  return priorYears.at(-1) as keyof typeof formsByYear;
};

export const getCmitInfo = (requestedYear: number) => {
  const year = findClosestYear(requestedYear);
  return formsByYear[year].CMIT_LIST;
};

export const getReportTemplate = (
  reportType: ReportType,
  requestedYear: number
) => {
  const year = findClosestYear(requestedYear);
  switch (reportType) {
    case ReportType.QMS:
      return formsByYear[year].qmsReportTemplate as Report;
    default:
      assertExhaustive(reportType);
      throw new Error(
        `Not implemented - getReportTemplate for ReportType ${reportType}`
      );
  }
};
