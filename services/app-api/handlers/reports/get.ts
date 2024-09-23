import handler from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, ok } from "../../libs/response-lib";
import { getReport } from "../../storage/reports";

export const get = handler(async (event) => {
  const { allParamsValid, reportType, state, id } =
    parseReportParameters(event);
  if (!allParamsValid) {
    return badRequest("Invalid path parameters");
  }

  // TODO: Auth

  // Example without DB
  const report = await getReport(reportType, state, id);

  return ok(report);
});
