import { AnyObject } from "yup";

export const FacilityLengthOfStayCalc = (
  set: AnyObject,
  multiplier: number
) => {
  const { numerator, denominator } = set;
  // "count-of-success-dis"
  // "expected-count-of-success-dis"
  // "multi-plan"
  // "opr-min-stay"
  // "epr-min-stay"
  // "rar-min-stay"
};

export const NDRCalc = (set: AnyObject, multiplier: number) => {
  const { numerator, denominator } = set;
  if (
    numerator === undefined ||
    numerator === "" ||
    denominator === undefined ||
    denominator === ""
  ) {
    return "";
  }

  return (Math.round((numerator / denominator) * 1000) / 10) * multiplier;
};
