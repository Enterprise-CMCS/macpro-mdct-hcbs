import { handler } from "../../libs/handler-lib";
import { parseReportParameters } from "../../libs/param-lib";
import { badRequest, forbidden, notFound } from "../../libs/response-lib";
import { getReport } from "../../storage/reports";
import { ReportStatus } from "../../types/reports";
import { canWriteState } from "../../utils/authorization";
import { error } from "../../utils/constants";
import { addQipTargetPage } from "./addQipTargetPage";

export const patchReport = handler(parseReportParameters, async (request) => {
  const { reportType, state, id } = request.parameters;
  const user = request.user;

  if (!canWriteState(user, state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  if (!request?.body || !("patchType" in request.body)) {
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

  switch (request.body.patchType) {
    case "addQipTargetPage":
      return addQipTargetPage(report, request.body);
    default:
      return badRequest("Unrecognized patch type");
  }
});
