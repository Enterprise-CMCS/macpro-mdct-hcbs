import { logger } from "../../libs/debug-lib";
import { handler } from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { putReport } from "../../storage/reports";
import { Report, ReportStatus } from "../../types/reports";
import { canWriteState } from "../../utils/authorization";
import { error } from "../../utils/constants";
import { validateReportPayload } from "../../utils/reportValidation";

export const submitReport = handler(parseReportParameters, async (request) => {
  const { reportType, state, id } = request.parameters;
  const user = request.user;

  if (!canWriteState(user, state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  if (!request?.body) {
    return badRequest("Invalid request");
  }

  // get the report that's being submitted
  const report = request.body as Report;
  if (
    reportType !== report.type ||
    state !== report.state ||
    id !== report.id
  ) {
    return badRequest("Invalid request");
  }

  // collect the user info of the submitter
  report.status = ReportStatus.SUBMITTED;
  report.lastEdited = Date.now();
  report.lastEditedBy = user.fullName;
  report.lastEditedByEmail = user.email;
  report.submitted = Date.now();
  report.submissionDates = [
    ...(report.submissionDates || []),
    {
      submitted: report.submitted,
    },
  ];
  report.submittedBy = user.fullName;
  report.submittedByEmail = user.email;
  report.submissionCount += 1;

  let validatedPayload: Report | undefined;
  try {
    validatedPayload = await validateReportPayload(report);
  } catch (err) {
    logger.error(err);
    return badRequest("Invalid request");
  }

  // save the report that's being submitted (with the new information on top of it)
  await putReport(validatedPayload);

  return ok(validatedPayload);
});
