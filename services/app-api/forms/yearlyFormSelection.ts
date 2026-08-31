import { assertExhaustive, ReportType } from "../types/reports";
import { ciReportTemplate as ciReportTemplate2026 } from "./2026/ci/ci";
import { CMIT_LIST as CMIT_LIST_2026 } from "./2026/cmit";
import { WAIVER_LIST as WAIVER_LIST_2026 } from "./2026/waivers";
import { qmsReportTemplate as qmsReportTemplate2026 } from "./2026/qms/qms";
import { tacmReportTemplate as tacmReportTemplate2026 } from "./2026/tacm/tacm";
import { pcpReportTemplate as pcpReportTemplate2026 } from "./2026/pcp/pcp";
import { qipReportTemplate as qipReportTemplate2026 } from "./2026/qip/qip";
import { wwlReportTemplate as wwlReportTemplate2026 } from "./2026/wwl/wwl";
import { ciReportTemplate as ciReportTemplate2028 } from "./2028/ci/ci";
import { CMIT_LIST as CMIT_LIST_2028 } from "./2028/cmit";
import { WAIVER_LIST as WAIVER_LIST_2028 } from "./2028/waivers";
import { qmsReportTemplate as qmsReportTemplate2028 } from "./2028/qms/qms";
import { tacmReportTemplate as tacmReportTemplate2028 } from "./2028/tacm/tacm";
import { imaReportTemplate as imaReportTemplate2028 } from "./2028/ima/ima";
import { pcpReportTemplate as pcpReportTemplate2028 } from "./2028/pcp/pcp";
import { qipReportTemplate as qipReportTemplate2028 } from "./2028/qip/qip";
import { wwlReportTemplate as wwlReportTemplate2028 } from "./2028/wwl/wwl";
import { StateAbbr } from "../utils/constants";

const formsByYear = {
  2026: {
    CMIT_LIST: CMIT_LIST_2026,
    WAIVER_LIST: WAIVER_LIST_2026,
    qmsReportTemplate: qmsReportTemplate2026,
    tacmReportTemplate: tacmReportTemplate2026,
    ciReportTemplate: ciReportTemplate2026,
    pcpReportTemplate: pcpReportTemplate2026,
    qipReportTemplate: qipReportTemplate2026,
    wwlReportTemplate: wwlReportTemplate2026,
  },
  2028: {
    CMIT_LIST: CMIT_LIST_2028,
    WAIVER_LIST: WAIVER_LIST_2028,
    qmsReportTemplate: qmsReportTemplate2028,
    tacmReportTemplate: tacmReportTemplate2028,
    ciReportTemplate: ciReportTemplate2028,
    imaReportTemplate: imaReportTemplate2028,
    pcpReportTemplate: pcpReportTemplate2028,
    qipReportTemplate: qipReportTemplate2028,
    wwlReportTemplate: wwlReportTemplate2028,
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

export const getWaiverInfo = (year: number, state: StateAbbr) => {
  assertYearIsValid(year);
  return formsByYear[year].WAIVER_LIST.filter(
    (waiver) => waiver.state === state
  );
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
    case ReportType.PCP:
      return formsByYear[year].pcpReportTemplate;
    case ReportType.IMA:
      if (year < 2028) {
        throw new Error(
          `Invalid year - form templates for ${year} are not implemented`
        );
      }
      return formsByYear[2028].imaReportTemplate;
    case ReportType.QIP:
      return formsByYear[year].qipReportTemplate;
    case ReportType.WWL:
      return formsByYear[year].wwlReportTemplate;
    default:
      assertExhaustive(reportType);
      throw new Error(
        `Not implemented - getReportTemplate for ReportType ${reportType}`
      );
  }
};
