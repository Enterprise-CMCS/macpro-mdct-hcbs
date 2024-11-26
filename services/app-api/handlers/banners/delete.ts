import { handler } from "../../libs/handler-lib";
import { canWriteBanner } from "../../utils/authorization";
import { error } from "../../utils/constants";
import { deleteBanner as deleteBannerById } from "../../storage/banners";
import { forbidden, ok } from "../../libs/response-lib";
import { parseBannerId } from "../../libs/param-lib";

export const deleteBanner = handler(parseBannerId, async (request) => {
  const { bannerId } = request.parameters;
  const user = request.user;

  if (!canWriteBanner(user)) {
    return forbidden(error.UNAUTHORIZED);
  }
  await deleteBannerById(bannerId);
  return ok();
});
