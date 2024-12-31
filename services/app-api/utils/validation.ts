import { AnyObject } from "../types/types";
import { error } from "./constants";

// compare payload data against validation schema
export const validateData = async (
  validationSchema: AnyObject,
  data: AnyObject,
  options?: AnyObject
) => {
  try {
    // returns valid data to be passed through API
    return await validationSchema.validate(data, {
      stripUnknown: true,
      ...options,
    });
  } catch {
    throw new Error(error.INVALID_DATA);
  }
};
