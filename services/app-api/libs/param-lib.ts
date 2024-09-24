import { isReportType } from "../types/reports";
import { APIGatewayProxyEvent } from "../types/types";
import { isStateAbbreviation } from "../utils/constants";
import { logger } from "./debug-lib";

export const parseReportTypeAndState = (event: APIGatewayProxyEvent) => {
  const { reportType, state } = event.pathParameters ?? {};

  if (!isReportType(reportType)) {
    logger.warn("Invalid report type in path");
    return { allParamsValid: false as const };
  }
  if (!isStateAbbreviation(state)) {
    logger.warn("Invalid state abbreviation in path");
    return { allParamsValid: false as const };
  }

  return { allParamsValid: true as const, reportType, state };
};

export const parseReportParameters = (event: APIGatewayProxyEvent) => {
  const { reportType, state, id } = event.pathParameters ?? {};

  if (!isReportType(reportType)) {
    logger.warn("Invalid report type in path");
    return { allParamsValid: false as const };
  }
  if (!isStateAbbreviation(state)) {
    logger.warn("Invalid state abbreviation in path");
    return { allParamsValid: false as const };
  }
  if (!id) {
    logger.warn("Missing report ID in path");
    return { allParamsValid: false as const };
  }

  return { allParamsValid: true as const, reportType, state, id };
};
