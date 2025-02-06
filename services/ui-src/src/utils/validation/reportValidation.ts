import { array, object, string } from "yup";

export const elementsValidateSchema = object().shape({
  elements: array().of(
    object().shape({
      answer: string().required("A response is required"),
    })
  ),
});
