import { handler } from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { ok } from "../../libs/response-lib";
import { getReport } from "../../storage/reports";

export const get = handler(parseReportParameters, async (event) => {
  const { reportType, state, id } = event.parameters;

  // TODO: Auth

  // Example without DB
  const report = await getReport(reportType, state, id);

  return ok(report);
});
