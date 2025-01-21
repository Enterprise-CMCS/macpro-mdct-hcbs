import { number, object, string } from "yup";
import { BannerData } from "../types/banner";
import { error } from "./constants";

const bannerValidateSchema = object().shape({
  key: string().required(),
  title: string().required(),
  description: string().required(),
  link: string().url().notRequired(),
  startDate: number().notRequired(),
  endDate: number().notRequired(),
});

export const validateBannerPayload = async (payload: object | undefined) => {
  if (!payload) {
    throw new Error(error.MISSING_DATA);
  }

  const validatedPayload = await bannerValidateSchema.validate(payload, {
    stripUnknown: true,
  });

  return validatedPayload as BannerData;
};
