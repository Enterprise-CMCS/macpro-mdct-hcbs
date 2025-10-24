import { parseNumber } from "components/rates/calculations";
import { ErrorMessages } from "../../constants";
import { parseMMDDYYYY } from "utils";
import * as yup from "yup";

/**
 * Copy the given object, with the same shape but all string values wiped out.
 *
 * We use this function to build error message objects for rate components.
 * If we have an `answer` object with number values like `{ num: 3, denom: 4 }`,
 * we will have a `displayValue` object with the same shape but string values,
 * like `{ num: "3", denom: "4" }`. Then we will hold error messages in a third
 * object, the same shape as the `displayValue`. It might eventually look like
 * `{ num: "A response is required", denom: "Response must be a number" }`.
 *
 * The error message object will be re-created on page load, with empty values.
 * As the user types inputs, we update the error message values accordingly.
 * @example
 * const displayValue = { denominator: "37", rates: [{ numerator: "29" }] };
 * const errorObj = makeEmptyStringCopyOf(displayValue);
 * //=> { denominator: "", rates: [{ numerator: "" }] }
 */
export const makeEmptyStringCopyOf = <T>(obj: T): T => {
  if ("string" === typeof obj) {
    return "" as T;
  } else if (Array.isArray(obj)) {
    return obj.map((element) => makeEmptyStringCopyOf(element)) as T;
  } else if (obj !== null && "object" === typeof obj) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        makeEmptyStringCopyOf(value),
      ])
    ) as T;
  } else {
    return obj;
  }
};

/** Determine whether the given value is a valid date. */
export const validateDate = (
  rawValue: string,
  maskedValue: string,
  isRequired: boolean
) => {
  const parsedValue = parseMMDDYYYY(maskedValue);
  const isValid = parsedValue !== undefined;
  let errorMessage = "";
  if (!isValid) {
    if (!rawValue && isRequired) {
      errorMessage = ErrorMessages.requiredResponse;
    } else if (isRequired) {
      errorMessage = ErrorMessages.mustBeADate;
    } else if (rawValue && !isRequired) {
      errorMessage = ErrorMessages.mustBeADateOptional;
    }
  }
  return { parsedValue, isValid, errorMessage };
};

/** Determine whether the given value is a valid number. */
export const validateNumber = (rawValue: string, isRequired: boolean) => {
  const parsedValue = parseNumber(rawValue);
  const isValid = parsedValue !== undefined;
  let errorMessage = "";
  if (!isValid) {
    if (!rawValue && isRequired) {
      errorMessage = ErrorMessages.requiredResponse;
    } else if (rawValue) {
      errorMessage = ErrorMessages.mustBeANumber;
    }
  }
  return { parsedValue, isValid, errorMessage };
};

/** Determine whether the given value is a valid HTTP or HTTPS URL */
export const isUrl = (value: string | undefined) => {
  if (!value) return false;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

/** Determine whether the given value is a valid email address */
export const isEmail = (value: string | undefined) => {
  return yup.string().email().required().isValidSync(value);
};
