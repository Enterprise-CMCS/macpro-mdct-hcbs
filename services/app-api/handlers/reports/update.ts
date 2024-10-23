import handler from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, ok } from "../../libs/response-lib";
import { putReport } from "../../storage/reports";
import { Report } from "../../types/reports";

export const updateReport = handler(async (event) => {
  const { allParamsValid, reportType, state, id } =
    parseReportParameters(event);
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
    state !== report.state ||
    id !== report.id
  ) {
    return badRequest("Invalid request");
  }

  // Validation required.
  await putReport(report);

  return ok();
});
