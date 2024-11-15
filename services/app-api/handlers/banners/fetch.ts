import { handler } from "../../libs/handler-lib";
// utils
import { error } from "../../utils/constants";
import { getBanner } from "../../storage/banners";
import { badRequest, ok } from "../../libs/response-lib";
import { parseBanner } from "../../libs/param-lib";

export const fetchBanner = handler(parseBanner, async (request) => {
  const { bannerId } = request.parameters;
  if (!bannerId) {
    return badRequest(error.NO_KEY);
  }
  const banner = await getBanner(bannerId);
  return ok(banner);
});
