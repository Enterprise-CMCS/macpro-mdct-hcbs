import { handler } from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { putReport } from "../../storage/reports";
import { Report, ReportStatus } from "../../types/reports";
import { canWriteState } from "../../utils/authorization";
import { error } from "../../utils/constants";

export const updateReport = handler(parseReportParameters, async (request) => {
  const { reportType, state, id } = request.parameters;
  const user = request.user;

  if (!canWriteState(user, state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  if (!request?.body) {
    return badRequest("Invalid request");
  }

  const report = request.body as Report;
  if (
    reportType !== report.type ||
    state !== report.state ||
    id !== report.id
  ) {
    return badRequest("Invalid request");
  }

  report.status = ReportStatus.IN_PROGRESS;
  report.lastEdited = Date.now();
  report.lastEditedBy = user.fullName;

  // Validation required.
  await putReport(report);

  return ok();
});
