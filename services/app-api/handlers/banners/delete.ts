import { handler } from "../../libs/handler-lib";
import { canWriteBanner } from "../../utils/authorization";
import { error } from "../../utils/constants";
import { deleteBanner as deleteBannerById } from "../../storage/banners";
import { forbidden, ok } from "../../libs/response-lib";
import { parseBannerKey } from "../../libs/param-lib";

export const deleteBanner = handler(parseBannerKey, async (request) => {
  const { bannerKey } = request.parameters;
  const user = request.user;

  if (!canWriteBanner(user)) {
    return forbidden(error.UNAUTHORIZED);
  }

  await deleteBannerById(bannerKey);
  return ok();
});
