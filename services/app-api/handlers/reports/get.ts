import handler from "../../libs/handler-lib";
import { getReport } from "../../storage/reports";
import { ReportType } from "../../types/reports";
import { StatusCodes } from "../../types/types";
import { State } from "../../utils/constants";

export const get = handler(async (event, _context) => {
  const { reportType, state, id } = event.pathParameters ?? {};

  // TODO: Auth

  if (!reportType || !state || !id) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: "Invalid request",
    };
  }

  // Example without DB
  const report = await getReport(reportType as ReportType, state as State, id);

  return { status: StatusCodes.SUCCESS, body: report };
});
