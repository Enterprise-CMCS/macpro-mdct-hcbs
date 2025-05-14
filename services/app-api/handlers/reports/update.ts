import { logger } from "../../libs/debug-lib";
import { handler } from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { putReport } from "../../storage/reports";
import { ReportStatus } from "../../types/reports";
import { canWriteState } from "../../utils/authorization";
import { error } from "../../utils/constants";
import { validateReportPayload } from "../../utils/reportValidation";

export const updateReport = handler(parseReportParameters, async (request) => {
  const { reportType, state, id } = request.parameters;
  const user = request.user;

  if (!canWriteState(user, state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  if (!request?.body) {
    return badRequest("Invalid request");
  }

  let report;
  try {
    report = await validateReportPayload(request.body);
  } catch (err) {
    logger.error(err);
    return badRequest("Invalid request");
  }

  if (
    reportType !== report.type ||
    state !== report.state ||
    id !== report.id ||
    report.status === ReportStatus.SUBMITTED
  ) {
    return badRequest("Invalid request");
  }

  report.status = ReportStatus.IN_PROGRESS;
  report.lastEdited = Date.now();
  report.lastEditedBy = user.fullName;

  await putReport(report);

  return ok();
});
