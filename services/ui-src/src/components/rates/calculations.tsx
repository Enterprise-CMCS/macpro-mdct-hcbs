import { AnyObject } from "yup";

export const FacilityLengthOfStayCalc = (set: AnyObject) => {
  const { numerator, denominator } = set;
  // "count-of-success-dis"
  // "expected-count-of-success-dis"
  // "multi-plan"
  // "opr-min-stay"
  // "epr-min-stay"
  // "rar-min-stay"
};

export const NDRCalc = (set: AnyObject) => {
  const { numerator, denominator } = set;
  return Math.round((numerator / denominator) * 1000) / 10;
};
