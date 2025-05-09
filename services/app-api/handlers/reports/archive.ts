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
    const { user, body } = request;

    if (!canArchiveReport(user)) {
      return forbidden(error.UNAUTHORIZED);
    }

    if (!isValidRequest(body)) {
      return badRequest("Invalid request");
    }

    const report = await getReport(reportType, state, id);
    if (!report) return notFound();

    report.archived = body.archived;
    await putReport(report);

    return ok();
  }
);

type ArchivalRequest = {
  archived: boolean;
};

const isValidRequest = (body: object | undefined): body is ArchivalRequest => {
  return !!body && "archived" in body && "boolean" === typeof body.archived;
};
