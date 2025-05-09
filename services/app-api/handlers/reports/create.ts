import { handler } from "../../libs/handler-lib";
import { parseReportTypeAndState } from "../../libs/param-lib";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { canWriteState } from "../../utils/authorization";
import { error } from "../../utils/constants";
import { buildReport } from "./buildReport";
import { ReportOptions } from "../../types/reports";
import { putReport } from "../../storage/reports";

export const createReport = handler(
  parseReportTypeAndState,
  async (request) => {
    const { reportType, state } = request.parameters;
    const user = request.user;
    const body = request.body;

    if (!canWriteState(user, state)) {
      return forbidden(error.UNAUTHORIZED);
    }

    if (!request?.body) {
      return badRequest("Invalid request");
    }

    const options = body as ReportOptions;
    const report = await buildReport(reportType, state, options, user);
    await putReport(report);

    return ok(report);
  }
);
