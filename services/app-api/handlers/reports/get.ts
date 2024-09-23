import handler from "../../libs/handler-lib";
import { badRequest, ok } from "../../libs/response-lib";
import { getReport } from "../../storage/reports";
import { ReportType } from "../../types/reports";
import { State } from "../../utils/constants";

export const get = handler(async (event) => {
  const { reportType, state, id } = event.pathParameters ?? {};

  // TODO: Auth

  if (!reportType || !state || !id) {
    return badRequest("Invalid request");
  }

  // Example without DB
  const report = await getReport(reportType as ReportType, state as State, id);

  return ok(report);
});
