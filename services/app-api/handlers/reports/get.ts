import { handler } from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { forbidden, ok } from "../../libs/response-lib";
import { getReport } from "../../storage/reports";
import { canReadState } from "../../utils/authorization";
import { error } from "../../utils/constants";

export const get = handler(parseReportParameters, async (request) => {
  const { reportType, state, id } = request.parameters;
  const user = request.user;

  if (!canReadState(user, state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  const report = await getReport(reportType, state, id);

  return ok(report);
});
