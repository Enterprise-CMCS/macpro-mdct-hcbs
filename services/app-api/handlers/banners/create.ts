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
import { number, object, string } from "yup";
import { validateData } from "../../utils/validation";

const validationSchema = object().shape({
  key: string().required(),
  title: string().required(),
  description: string().required(),
  link: string().url().notRequired(),
  startDate: number().required(),
  endDate: number().required(),
});

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

  const validatedPayload = await validateData(
    validationSchema,
    unvalidatedPayload
  );

  const { title, description, link, startDate, endDate } =
    validatedPayload as BannerData;

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
