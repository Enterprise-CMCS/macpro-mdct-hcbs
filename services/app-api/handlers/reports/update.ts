import { logger } from "../../libs/debug-lib";
import { handler } from "../../libs/handler-lib";
import { getFlag } from "../../libs/launchdarkly-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { getReport, putReport } from "../../storage/reports";
import { Report, ReportStatus } from "../../types/reports";
import { canWriteState } from "../../utils/authorization";
import { error } from "../../utils/constants";
import { validateReportPayload } from "../../utils/reportValidation";
import { sendEmail } from "../../utils/notifications/email";

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
  } catch (error) {
    logger.error(error);
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

  const notificationsEnabled = await getFlag("notificationsSystem");
  let savedReport: Report | undefined;
  if (notificationsEnabled) {
    try {
      savedReport = await getReport(reportType, state, id);
    } catch (error) {
      logger.error(error);
    }
  }

  report.status = ReportStatus.IN_PROGRESS;
  report.lastEdited = Date.now();
  report.lastEditedBy = user.fullName;

  await putReport(report);

  if (notificationsEnabled && savedReport?.status === ReportStatus.SUBMITTED) {
    try {
      await sendEmail(report);
    } catch (error) {
      logger.error(error);
    }
  }

  return ok();
});
