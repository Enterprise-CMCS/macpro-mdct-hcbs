import { logger } from "../../libs/debug-lib";
import { handler } from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, forbidden, ok, notFound } from "../../libs/response-lib";
import { getReport, updateFields } from "../../storage/reports";
import { ReportStatus } from "../../types/reports";
import { canWriteState } from "../../utils/authorization";
import { error } from "../../utils/constants";
import { validateReportEditPayload } from "../../utils/reportValidation";

export const partialUpdateReport = handler(
  parseReportParameters,
  async (request) => {
    const { reportType, state, id } = request.parameters;
    const user = request.user;

    if (!canWriteState(user, state)) {
      return forbidden(error.UNAUTHORIZED);
    }

    if (!request?.body) {
      return badRequest("Invalid request");
    }

    const report = await getReport(reportType, state, id);
    if (!report) return notFound();
    if (
      reportType !== report.type ||
      state !== report.state ||
      id !== report.id ||
      report.status === ReportStatus.SUBMITTED
    ) {
      return badRequest("Invalid request");
    }

    let fieldsToUpdate;
    try {
      fieldsToUpdate = await validateReportEditPayload(request.body);
    } catch (err) {
      logger.error(err);
      return badRequest("Invalid request");
    }

    await updateFields(fieldsToUpdate, reportType, state, id);

    return ok();
  }
);
