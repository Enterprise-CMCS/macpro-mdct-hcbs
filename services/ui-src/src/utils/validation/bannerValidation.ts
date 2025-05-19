import { BannerData } from "types/banners";
import { checkDateCompleteness, parseMMDDYYYY } from "utils/other/time";
import { boolean, number, object, string } from "yup";
import { error } from "../../constants";
/**
 * This schema is used for live validation as the user fills out the form.
 * It differs from the banner write schema below, because the shape of the data
 * we bind to the form differs from the shape of the data we send to the backend.
 * We transform from one shape to the other in `onSubmit()`.
 */
export const bannerFormValidateSchema = object()
  .shape({
    bannerTitle: object().shape({
      answer: string().required("A response is required"),
    }),
    bannerDescription: object().shape({
      answer: string().required("A response is required"),
    }),
    bannerLink: object().shape({
      answer: string()
        .url("Response must be a valid hyperlink/URL")
        .notRequired(),
    }),
    bannerStartDate: object().shape({
      answer: string()
        .test({
          message:
            "Start date is invalid. Please enter date in MM/DD/YYYY format",
          test: (value) => {
            if (value) {
              return (
                checkDateCompleteness(value) !== null &&
                parseMMDDYYYY(value) !== null
              );
            } else return true;
          },
        })
        .required("A response is required"),
    }),
    bannerEndDate: object().shape({
      answer: string()
        .test({
          message:
            "End date is invalid. Please enter date in MM/DD/YYYY format",
          test: (value) => {
            if (value) {
              return (
                checkDateCompleteness(value) !== null &&
                parseMMDDYYYY(value) !== null
              );
            } else return true;
          },
        })
        .required("A response is required"),
    }),
  })
  .test(
    "start-date-before-end-date-form",
    "End date must be after start date",
    function (value) {
      const { bannerStartDate, bannerEndDate } = value || {};
      const startDateString = bannerStartDate?.answer;
      const endDateString = bannerEndDate?.answer;

      if (startDateString && endDateString) {
        const startDate = parseMMDDYYYY(startDateString);
        const endDate = parseMMDDYYYY(endDateString);

        if (startDate && endDate) {
          if (endDate <= startDate) {
            return this.createError({
              path: "bannerEndDate.answer",
              message: "End date must be after start date",
            });
          }
        } else {
          return true;
        }
      }
      return true;
    }
  );

const bannerWriteValidateSchema = object().shape({
  key: string().required(),
  title: string().required(),
  description: string().required(),
  link: string().url().notRequired(),
  startDate: number().notRequired(),
  endDate: number()
    .notRequired()
    .when("startDate", (startDate, schema) => {
      const actualStartDate = Array.isArray(startDate)
        ? startDate[0]
        : startDate;
      if (typeof actualStartDate === "number") {
        return schema.test({
          name: "is-after-start-date-write",
          message: error.END_DATE_BEFORE_START_DATE,
          test: function (endDateValue) {
            if (typeof endDateValue === "number") {
              return endDateValue > actualStartDate;
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
    throw new Error("missing data");
  }

  const validatedPayload = await bannerWriteValidateSchema.validate(payload, {
    stripUnknown: true,
  });

  return validatedPayload as BannerData;
};
