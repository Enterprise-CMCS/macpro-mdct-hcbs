import { handler } from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { canReleaseReport } from "../../utils/authorization";
import { error } from "../../utils/constants";
import { getReport, putReport } from "../../storage/reports";
import { ReportStatus } from "../../types/reports";

export const releaseReport = handler(parseReportParameters, async (request) => {
  const { reportType, state, id } = request.parameters;
  const user = request.user;

  if (!canReleaseReport(user)) {
    return forbidden(error.UNAUTHORIZED);
  }

  if (!request?.body) {
    return badRequest("Invalid request");
  }

  const report = await getReport(reportType, state, id);

  // Report is not locked.
  if (report?.status !== ReportStatus.SUBMITTED) {
    return ok(report);
  }

  //can't unlock and archived report
  if (report.archived) {
    return forbidden(error.ALREADY_ARCHIVED);
  }

  report.status = ReportStatus.IN_PROGRESS;

  // save the report that's being submitted (with the new information on top of it)
  await putReport(report);

  return ok();
});
