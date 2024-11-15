import { handler } from "../../libs/handler-lib";
// utils
import { canWriteAdmin } from "../../utils/authorization";
import { error } from "../../utils/constants";
import { deleteBanner as deleteBannerById } from "../../storage/banners";
// types
import { UserRoles } from "../../types/types";
import { badRequest, forbidden, ok } from "../../libs/response-lib";
import { parseBanner } from "../../libs/param-lib";

export const deleteBanner = handler(parseBanner, async (request) => {
  const { bannerId } = request.parameters;
  const user = request.user;

  if (!canWriteAdmin(user)) {
    return forbidden(error.UNAUTHORIZED);
  }
  if (!bannerId) {
    return badRequest(error.NO_KEY);
  }
  await deleteBannerById(bannerId);
  return ok();
});
