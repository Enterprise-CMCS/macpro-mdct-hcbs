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

export const emptyParser = (_event: APIGatewayProxyEvent) => ({});

export const parseNotificationAssignmentEmail = (
  event: APIGatewayProxyEvent
) => {
  const encodedEmail = event.pathParameters?.email;
  if (!encodedEmail) {
    logger.warn("Missing email in path");
    return undefined;
  }

  try {
    return { email: decodeURIComponent(encodedEmail).trim().toLowerCase() };
  } catch {
    logger.warn("Invalid email in path");
    return undefined;
  }
};

export const parseBannerKey = (event: APIGatewayProxyEvent) => {
  const bannerKey = event.pathParameters?.bannerId;
  if (!bannerKey) {
    logger.warn("Invalid banner key in path");
    return undefined;
  }

  return { bannerKey };
};
