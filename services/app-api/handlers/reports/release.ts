import { handler } from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { canWriteState } from "../../utils/authorization";
import { error } from "../../utils/constants";
import { getReport, putReport } from "../../storage/reports";

export const releaseReport = handler(parseReportParameters, async (request) => {
  const { reportType, state, id } = request.parameters;
  const user = request.user;

  if (!canWriteState(user, state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  if (!request?.body) {
    return badRequest("Invalid request");
  }

  const report = await getReport(reportType, state, id);

  const isLocked = report?.locked;
  // Report is not locked.
  if (!isLocked) {
    return ok(report);
  }

  //can't unlock and archived report
  const isArchived = report.archived;
  if (isArchived) {
    return forbidden(error.ALREADY_ARCHIVED);
  }

  report.locked = false;

  // save the report that's being submitted (with the new information on top of it)
  await putReport(report);

  return ok();
});
