import handler from "../../libs/handler-lib";
import {
  parseReportParameters,
  parseReportTypeAndState,
} from "../../libs/param-lib";
import { badRequest, ok } from "../../libs/response-lib";
import {
  getReport as getReportFromDatabase,
  queryReportsForState,
} from "../../storage/reports";

export const getReport = handler(async (event) => {
  const { allParamsValid, reportType, state, id } =
    parseReportParameters(event);
  if (!allParamsValid) {
    return badRequest("Invalid path parameters");
  }

  // TODO: Auth

  const report = await getReportFromDatabase(reportType, state, id);

  return ok(report);
});

export const getReportsForState = handler(async (event) => {
  const { allParamsValid, reportType, state } = parseReportTypeAndState(event);
  if (!allParamsValid) {
    return badRequest("Invalid path parameters");
  }

  // TODO: Auth

  const reports = await queryReportsForState(reportType, state);

  return ok(reports);
});
