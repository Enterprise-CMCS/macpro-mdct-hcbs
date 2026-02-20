import { logger } from "../libs/debug-lib";
import { BannerAreas, BannerFormData, isBannerArea } from "../types/banner";
import { isIsoDateString, isValidUrl } from "../types/types";

export const isValidBanner = (banner: unknown): banner is BannerFormData => {
  if (!banner || "object" !== typeof banner) {
    logger.warn("Invalid: banner must be an object");
    return false;
  }

  const requiredFields = [
    "title",
    "area",
    "description",
    "startDate",
    "endDate",
  ];
  const optionalFields = [
    // Link is optional in create requests
    "link",
    // System-generated fields; may be present in update requests
    "key",
    "createdAt",
    "lastAltered",
    "lastAlteredBy",
  ];
  const allowedFields = requiredFields.concat(optionalFields);
  if (Object.keys(banner).some((key) => !allowedFields.includes(key))) {
    logger.warn("Invalid: banner contains unwanted fields");
    return false;
  }

  if (!("title" in banner) || "string" !== typeof banner.title) {
    logger.warn("Invalid: banner.title must be a string");
    return false;
  }

  if (!("area" in banner) || !isBannerArea(banner.area)) {
    const validAreas = Object.values(BannerAreas).join(", ");
    logger.warn(`Invalid: banner.area must be one of: ${validAreas}`);
    return false;
  }

  if (!("description" in banner) || "string" !== typeof banner.description) {
    logger.warn("Invalid: banner.description must be a string");
    return false;
  }

  if ("link" in banner && !!banner.link && !isValidUrl(banner.link)) {
    logger.warn("Invalid: banner.link, if present, must be a valid URL");
    return false;
  }

  if (!("startDate" in banner) || !isIsoDateString(banner.startDate)) {
    logger.warn("Invalid: banner.startDate must be an ISO date string");
    return false;
  }

  if (!("endDate" in banner) || !isIsoDateString(banner.endDate)) {
    logger.warn("Invalid: banner.endDate must be an ISO date string");
    return false;
  }

  if (new Date(banner.endDate) < new Date(banner.startDate)) {
    logger.warn("Invalid: banner.endDate must be after banner.startDate");
    return false;
  }

  return true;
};
