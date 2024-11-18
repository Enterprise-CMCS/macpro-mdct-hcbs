import { handler } from "../../libs/handler-lib";
import { getBanner } from "../../storage/banners";
import { ok } from "../../libs/response-lib";
import { parseBannerId } from "../../libs/param-lib";

export const fetchBanner = handler(parseBannerId, async (request) => {
  const { bannerId } = request.parameters;
  const banner = await getBanner(bannerId);
  return ok(banner);
});
