import { BannerData } from "types/banners";
import { checkDateCompleteness } from "utils/other/time";
import { boolean, number, object, string } from "yup";

/**
 * This schema is used for live validation as the user fills out the form.
 * It differs from the banner write schema below, because the shape of the data
 * we bind to the form differs from the shape of the data we send to the backend.
 * We transform from one shape to the other in `onSubmit()`.
 */
export const bannerFormValidateSchema = object().shape({
  bannerTitle: object().shape({
    answer: string().required("Title is required"),
  }),
  bannerDescription: object().shape({
    answer: string().required("Description is required"),
  }),
  bannerLink: object().shape({
    answer: string().url().notRequired(),
  }),
  bannerStartDate: object().shape({
    answer: string()
      .test({
        message:
          "Start date is invalid. Please enter date in MM/DD/YYYY format",
        test: (value) => {
          if (value) {
            return checkDateCompleteness(value) !== null;
          } else return true;
        },
      })
      .required("Start date is required"),
  }),
  bannerEndDate: object().shape({
    answer: string()
      .test({
        message: "End date is invalid. Please enter date in MM/DD/YYYY format",
        test: (value) => {
          if (value) {
            return checkDateCompleteness(value) !== null;
          } else return true;
        },
      })
      .required("End date is required"),
  }),
});

const bannerWriteValidateSchema = object().shape({
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

  const validatedPayload = await bannerWriteValidateSchema.validate(payload, {
    stripUnknown: true,
  });

  return validatedPayload as BannerData;
};
