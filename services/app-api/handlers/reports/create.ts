import handler from "../../libs/handler-lib";
import { parseReportTypeAndState } from "../../libs/param-lib";
import { badRequest, ok } from "../../libs/response-lib";
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
  // const options = JSON.parse(event.body);

  const report = await buildReport(reportType, state, [], user);

  return ok(report);
});
