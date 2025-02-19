import { ElementType, PageElement } from "types";
import { array, lazy, mixed, object, Schema, string } from "yup";

export const textboxSchema = object().shape({
  answer: string().required("A response is required"),
  type: string().notRequired(),
  label: string().notRequired(),
});

export const emailSchema = object().shape({
  answer: string()
    .email("Response must be a valid email address")
    .required("A response is required"),
  type: string().notRequired(),
  label: string().notRequired(),
});

export const radioSchema = object().shape({
  answer: string().required("A response is required"),
  type: string().notRequired(),
  label: string().notRequired(),
  value: array()
    .of(
      object().shape({
        // TODO: fix issue where checked children gets hidden and not cleared
        checkedChildren: array().of(
          object().shape({
            answer: string().required("A response is required"),
          })
        ),
      })
    )
    .notRequired(),
});

const pageElementSchema = lazy((element: PageElement): any => {
  switch (element?.type) {
    case ElementType.Textbox:
      if (element.label.includes("email address")) {
        return emailSchema;
      }
      return textboxSchema;
    case ElementType.TextAreaField:
      return textboxSchema;
    case ElementType.Date:
      // TODO: make date schema
      return textboxSchema;
    case ElementType.Radio:
      return radioSchema;
    default:
      return textboxSchema;
  }
});

// TODO: make delivery method radio work
export const elementsValidateSchema = object().shape({
  elements: array().of(pageElementSchema).required(),
  // "delivery-method-radio": object().shape({
  //   answer: string().required("A response is required"),
  // }),
});
