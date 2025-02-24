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

export const radioWithChildrenSchema = object().shape({
  answer: string().required("A response is required"),
  type: string().notRequired(),
  label: string().notRequired(),
  value: array().of(
    object().shape({
      checkedChildren: array().of(
        object().shape({
          answer: string().required("A response is required"),
        })
      ),
    })
  ),
});

export const radioSchema = object().shape({
  answer: string().required("A response is required"),
  type: string().notRequired(),
  label: string().notRequired(),
});

const pageElementSchema = lazy((element: PageElement): any => {
  switch (element?.type) {
    case ElementType.Textbox:
      if (element.label?.includes("email")) {
        return emailSchema;
      }
      return textboxSchema;
    case ElementType.TextAreaField:
      return textboxSchema;
    case ElementType.Date:
      // TODO: make date schema
      return textboxSchema;
    case ElementType.Radio:
      if (element.value) {
        return radioWithChildrenSchema;
      }
      return radioSchema;
    default:
      // if not one of the above types, there is no need to validate the element
      return mixed().notRequired();
  }
});

export const elementsValidateSchema = object().shape({
  elements: array().of(pageElementSchema).notRequired(),
});
