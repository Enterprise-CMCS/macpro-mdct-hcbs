import { handler } from "../../libs/handler-lib";
import { putBanner } from "../../storage/banners";
import { error } from "../../utils/constants";
import {
  badRequest,
  created,
  forbidden,
  internalServerError,
} from "../../libs/response-lib";
import { canWriteBanner } from "../../utils/authorization";
import { parseBannerId } from "../../libs/param-lib";
import { BannerData } from "../../types/banner";

export const createBanner = handler(parseBannerId, async (request) => {
  const { bannerId } = request.parameters;
  const user = request.user;

  if (!canWriteBanner(user)) {
    return forbidden(error.UNAUTHORIZED);
  }

  if (!request?.body) {
    return badRequest("Invalid request");
  }

  const unvalidatedPayload = request.body;

  //TO DO: add validation & validation test back
  const { title, description, link, startDate, endDate } =
    unvalidatedPayload as BannerData;

  const currentTime = Date.now();

  const newBanner = {
    key: bannerId,
    createdAt: currentTime,
    lastAltered: currentTime,
    lastAlteredBy: user.fullName,
    title,
    description,
    link,
    startDate,
    endDate,
  };
  try {
    await putBanner(newBanner);
  } catch {
    return internalServerError(error.CREATION_ERROR);
  }
  return created(newBanner);
});
