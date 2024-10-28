import { handler } from "../../libs/handler-lib";
import { parseReportTypeAndState } from "../../libs/param-lib";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { canWriteState } from "../../utils/authorization";
import { error } from "../../utils/constants";
import { buildReport } from "./buildReport";

export const createReport = handler(
  parseReportTypeAndState,
  async (request) => {
    const { reportType, state } = request.parameters;
    const user = request.user;

    if (!canWriteState(user, state)) {
      return forbidden(error.UNAUTHORIZED);
    }

    if (!request?.body) {
      return badRequest("Invalid request");
    }
    // const options = JSON.parse(event.body);

    const report = await buildReport(reportType, state, [], user.full_name);

    return ok(report);
  }
);
