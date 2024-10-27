import { handler } from "../../libs/handler-lib";
import { parseReportTypeAndState } from "../../libs/param-lib";
import { badRequest, ok } from "../../libs/response-lib";
import { buildReport } from "./buildReport";

export const createReport = handler(parseReportTypeAndState, async (event) => {
  const { reportType, state } = event.parameters;

  // TODO: Auth
  const user = "";

  if (!event?.body) {
    return badRequest("Invalid request");
  }
  // const options = JSON.parse(event.body);

  const report = await buildReport(reportType, state, [], user);

  return ok(report);
});
