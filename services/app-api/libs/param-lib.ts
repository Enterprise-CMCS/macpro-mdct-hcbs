import { isReportType } from "../types/reports";
import { APIGatewayProxyEvent } from "../types/types";
import { isStateAbbreviation } from "../utils/constants";
import { logger } from "./debug-lib";

export const parseReportTypeAndState = (event: APIGatewayProxyEvent) => {
  const { reportType, state } = event.pathParameters ?? {};

  if (!isReportType(reportType)) {
    logger.warn("Invalid report type in path");
    return undefined;
  }
  if (!isStateAbbreviation(state)) {
    logger.warn("Invalid state abbreviation in path");
    return undefined;
  }

  return { reportType, state };
};

export const parseReportParameters = (event: APIGatewayProxyEvent) => {
  const { reportType, state, id } = event.pathParameters ?? {};

  if (!isReportType(reportType)) {
    logger.warn("Invalid report type in path");
    return undefined;
  }
  if (!isStateAbbreviation(state)) {
    logger.warn("Invalid state abbreviation in path");
    return undefined;
  }
  if (!id) {
    logger.warn("Missing report ID in path");
    return undefined;
  }

  return { reportType, state, id };
};

export const parseBannerId = (event: APIGatewayProxyEvent) => {
  const { bannerId } = event.pathParameters ?? {};
  if (!bannerId) {
    logger.warn("Invalid banner id in path");
    return undefined;
  }

  return { bannerId };
};
