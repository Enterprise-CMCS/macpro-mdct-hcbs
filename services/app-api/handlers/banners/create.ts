import { handler } from "../../libs/handler-lib";
import { getBanner, putBanner } from "../../storage/banners";
import { randomUUID } from "node:crypto";
import { error } from "../../utils/constants";
import { badRequest, ok, forbidden } from "../../libs/response-lib";
import { canWriteBanner } from "../../utils/authorization";
import { emptyParser } from "../../libs/param-lib";
import { isValidBanner } from "../../utils/bannerValidation";
import { BannerShape } from "../../types/banner";

export const createBanner = handler(emptyParser, async (request) => {
  const user = request.user;

  if (!canWriteBanner(user)) {
    return forbidden(error.UNAUTHORIZED);
  }

  if (!isValidBanner(request.body)) {
    return badRequest("Invalid request");
  }

  const currentTime = new Date().toISOString();

  let existingBanner: BannerShape | undefined;
  if ("key" in request.body && "string" === typeof request.body.key) {
    existingBanner = await getBanner(request.body.key);
  }

  const newBanner = {
    ...request.body,
    key: existingBanner?.key ?? randomUUID(),
    createdAt: existingBanner?.createdAt ?? currentTime,
    lastAltered: currentTime,
    lastAlteredBy: user.fullName,
  };

  await putBanner(newBanner);

  return ok(newBanner);
});
