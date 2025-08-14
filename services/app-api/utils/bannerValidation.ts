import { boolean, number, object, string } from "yup";
import { BannerData } from "../types/banner";
import { error } from "./constants";

const bannerValidateSchema = object().shape({
  key: string().required(),
  title: string().required(),
  description: string().required(),
  link: string().url().notRequired(),
  startDate: number().notRequired(),
  endDate: number()
    .notRequired()
    .when("startDate", ([startDate], schema) => {
      if (typeof startDate === "number") {
        return schema.test({
          name: "is-after-start-date",
          message: error.END_DATE_BEFORE_START_DATE,
          test: function (endDateValue) {
            if (typeof endDateValue === "number") {
              return endDateValue >= startDate;
            }
            return true;
          },
        });
      }
      return schema;
    }),
  isActive: boolean().notRequired(),
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
