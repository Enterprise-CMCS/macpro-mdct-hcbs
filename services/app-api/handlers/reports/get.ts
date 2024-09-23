import handler from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, ok } from "../../libs/response-lib";
import { getReport } from "../../storage/reports";
import { ReportType } from "../../types/reports";
import { State } from "../../utils/constants";

export const get = handler(async (event) => {
  const { allParamsValid, reportType, state, id } =
    parseReportParameters(event);
  if (!allParamsValid) {
    return badRequest("Invalid path parameters");
  }

  // TODO: Auth

  // Example without DB
  const report = await getReport(reportType as ReportType, state as State, id);

  return ok(report);
});
