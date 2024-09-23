import handler from "../../libs/handler-lib";
import { badRequest, ok } from "../../libs/response-lib";
import { ReportType } from "../../types/reports";
import { State } from "../../utils/constants";
import { buildReport } from "./buildReport";

export const createReport = handler(async (event) => {
  const { reportType, state } = event.pathParameters ?? {};

  // TODO: Auth
  const user = "";

  if (!event?.body) {
    return badRequest("Invalid request");
  }
  // const options = JSON.parse(event.body);

  // Move to helper function
  if (!Object.values(ReportType).includes(reportType as ReportType)) {
    return badRequest("Report Type not available");
  }
  if (!state || !Object.keys(State).includes(state)) {
    return badRequest(`State not available: ${state}`);
  }

  const report = await buildReport(reportType as ReportType, state, [], user);

  return ok(report);
});
