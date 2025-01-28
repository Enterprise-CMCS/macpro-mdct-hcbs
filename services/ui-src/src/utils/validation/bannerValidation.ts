import { BannerData } from "types/banners";
import { boolean, number, object, string } from "yup";

const bannerValidateSchema = object().shape({
  key: string().required(),
  title: string().required(),
  description: string().required(),
  link: string().url().notRequired(),
  startDate: number().notRequired(),
  endDate: number().notRequired(),
  isActive: boolean().notRequired(),
});

export const validateBannerPayload = async (payload: object | undefined) => {
  if (!payload) {
    throw new Error("missing data");
  }

  const validatedPayload = await bannerValidateSchema.validate(payload, {
    stripUnknown: true,
  });

  return validatedPayload as BannerData;
};
