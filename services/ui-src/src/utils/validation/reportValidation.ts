import { ElementType, PageElement } from "types";
import { array, lazy, mixed, object, string } from "yup";

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
    .notRequired()
    .of(
      object().shape({
        // TODO: fix issue where checked children gets hidden and not cleared
        checkedChildren: array().of(
          object().shape({
            answer: string().required("you have a bad checked child"),
          })
        ),
      })
    ),
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
      console.log("HEY WHAT GOING ON HERE", element);
      // return radioSchema;
      return mixed().notRequired();
    default:
      // if not one of the above types, there is no need to validate the element
      return mixed().notRequired();
  }
});

export const elementsValidateSchema = object().shape({
  elements: array().of(pageElementSchema).notRequired(),
  /**
   * TODO: make delivery method radio work
   * "delivery-method-radio": object().shape({
   *     answer: string().required("A response is required"),
   * }),
   */
});
