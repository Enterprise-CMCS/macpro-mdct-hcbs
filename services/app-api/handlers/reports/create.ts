import handler from "../../libs/handler-lib";
import { ReportType } from "../../types/reports";
import { StatusCodes } from "../../types/types";
import { State } from "../../utils/constants";
import { buildReport } from "./buildReport";

export const createReport = handler(async (event, _context) => {
  const { reportType, state } = event.pathParameters ?? {};

  // TODO: Auth
  const user = "";

  if (!event?.body) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: "Invalid request",
    };
  }
  // const options = JSON.parse(event.body);

  // Move to helper function
  if (!Object.values(ReportType).includes(reportType as ReportType)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: "Report Type not available",
    };
  }
  if (!state || !Object.keys(State).includes(state)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: "State not available:" + state,
    };
  }

  const report = await buildReport(reportType as ReportType, state, [], user);

  return { status: StatusCodes.SUCCESS, body: report };
});
