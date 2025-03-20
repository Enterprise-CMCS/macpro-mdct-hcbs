import { AnyObject } from "yup";

const isFilled = (item: string) => {
  return item !== "" && item !== undefined;
};

export const FacilityLengthOfStayCalc = (
  rate: AnyObject,
  _multiplier: number
) => {
  rate["opr-min-stay"] = "";
  rate["epr-min-stay"] = "";
  rate["rar-min-stay"] = "";

  //Observed Performance Rate for the Minimizing Length of Facility Stay
  if (
    isFilled(rate["count-of-success-dis"]) &&
    isFilled(rate["fac-admin-count"])
  )
    rate["opr-min-stay"] =
      rate["count-of-success-dis"] / rate["fac-admin-count"];

  //Expected Performance Rate for the Minimizing Length of Facility Stay
  if (
    isFilled(rate["expected-count-of-success-dis"]) &&
    isFilled(rate["fac-admin-count"])
  )
    rate["epr-min-stay"] =
      rate["expected-count-of-success-dis"] / rate["fac-admin-count"];

  //Risk Adjusted Rate for the Minimizing Length of Facility Stay
  if (
    isFilled(rate["opr-min-stay"]) &&
    isFilled(rate["epr-min-stay"]) &&
    isFilled(rate["multi-plan"])
  )
    rate["rar-min-stay"] =
      (rate["opr-min-stay"] / rate["epr-min-stay"]) * rate["multi-plan"];

  return rate;
};

export const NDRCalc = (rate: AnyObject, multiplier: number) => {
  const { numerator, denominator } = rate;

  if (!isFilled(numerator) || !isFilled(denominator)) return "";

  return (Math.round((numerator / denominator) * 1000) / 10) * multiplier;
};
