import handler from "../../libs/handler-lib";
import { parseReportTypeAndState } from "../../libs/param-lib";
import { badRequest, ok } from "../../libs/response-lib";
import { putReport } from "../../storage/reports";
import { Report } from "../../types/reports";

export const updateReport = handler(async (event) => {
  const { allParamsValid, reportType, state } = parseReportTypeAndState(event);
  if (!allParamsValid) {
    return badRequest("Invalid path parameters");
  }

  // TODO: Auth

  if (!event?.body) {
    return badRequest("Invalid request");
  }

  const report = JSON.parse(event.body) as Report;
  if (
    reportType !== report.type ||
    report.state !== state ||
    report.id !== report.id
  ) {
    return badRequest("Invalid request");
  }

  // Validation required.
  await putReport(report);

  return ok();
});
