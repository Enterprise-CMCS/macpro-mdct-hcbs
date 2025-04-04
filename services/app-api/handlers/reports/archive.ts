import { handler } from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, forbidden, notFound, ok } from "../../libs/response-lib";
import { getReport, putReport } from "../../storage/reports";
import { canArchiveReport } from "../../utils/authorization";
import { error } from "../../utils/constants";

export const updateArchiveStatus = handler(
  parseReportParameters,
  async (request) => {
    const { reportType, state, id } = request.parameters;
    const user = request.user;
    const body = request.body as { archived: boolean | undefined };
    if (!canArchiveReport(user)) {
      return forbidden(error.UNAUTHORIZED);
    }

    if (body?.archived === undefined) {
      return badRequest("Invalid request");
    }

    const report = await getReport(reportType, state, id);

    if (!report) return notFound();
    report.archived = body.archived;
    await putReport(report);

    return ok();
  }
);
