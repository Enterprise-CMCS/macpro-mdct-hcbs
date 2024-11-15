import handler from "../../libs/handler-lib";
import { parseReportTypeAndState } from "../../libs/param-lib";
import { badRequest, ok } from "../../libs/response-lib";
import { ReportOptions } from "../../types/reports";
import { buildReport } from "./buildReport";

export const createReport = handler(async (event) => {
  const { allParamsValid, reportType, state } = parseReportTypeAndState(event);
  if (!allParamsValid) {
    return badRequest("Invalid path parameters");
  }

  // TODO: Auth
  const user = "";

  if (!event?.body) {
    return badRequest("Invalid request");
  }
  const options = JSON.parse(event.body) as ReportOptions;

  const report = await buildReport(reportType, state, options, user);

  return ok(report);
});
