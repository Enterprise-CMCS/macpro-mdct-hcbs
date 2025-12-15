import KSUID from "ksuid";
import { getReportTemplate } from "../../forms/yearlyFormSelection";
import {
  Report,
  ReportStatus,
  ReportOptions,
  ReportType,
} from "../../types/reports";
import { User } from "../../types/types";
import { validateReportPayload } from "../../utils/reportValidation";
import { logger } from "../../libs/debug-lib";
import { StateAbbr } from "../../utils/constants";

export const buildReport = async (
  reportType: ReportType,
  state: StateAbbr,
  reportOptions: ReportOptions,
  user: User
) => {
  const year = reportOptions.year;
  const template = getReportTemplate(reportType, year);

  const report: Report = {
    state: state,
    id: KSUID.randomSync().string,
    created: Date.now(),
    lastEdited: Date.now(),
    lastEditedBy: user.fullName,
    lastEditedByEmail: user.email,
    type: reportType,
    status: ReportStatus.NOT_STARTED,
    name: reportOptions.name,
    year: reportOptions.year,
    archived: false,
    submissionCount: 0,
    pages: structuredClone(template.pages),
  };

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

  return validatedReport;
};
