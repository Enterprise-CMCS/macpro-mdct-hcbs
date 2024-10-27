import { handler } from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, ok } from "../../libs/response-lib";
import { putReport } from "../../storage/reports";
import { Report } from "../../types/reports";

export const updateReport = handler(parseReportParameters, async (event) => {
  const { reportType, state, id } = event.parameters;

  // TODO: Auth

  if (!event?.body) {
    return badRequest("Invalid request");
  }

  const report = event.body as Report;
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
