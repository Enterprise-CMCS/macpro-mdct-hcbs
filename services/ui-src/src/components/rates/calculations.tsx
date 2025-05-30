import { AnyObject } from "yup";

const isFilled = (item: string) => {
  return item !== "" && item !== undefined;
};

const roundTo = (value: number, decimal: number) => {
  const shift = Math.pow(10, decimal);
  return Math.round(value * shift) / shift;
};

export const isNumber = (value: string) => {
  const allNumbers = /^-?\d*\.?\d*$/i;
  return allNumbers.test(value);
};

export const FacilityLengthOfStayCalc = (
  rate: AnyObject,
  _multiplier: number
) => {
  rate["opr-min-stay"] = "";
  rate["epr-min-stay"] = "";
  rate["rar-min-stay"] = "";

  //Observed Performance Rate for the Minimizing Length of Facility Stay
  if (isFilled(rate["count-of-success"]) && isFilled(rate["fac-count"]))
    rate["opr-min-stay"] = roundTo(
      rate["count-of-success"] / rate["fac-count"],
      2
    );

  //Expected Performance Rate for the Minimizing Length of Facility Stay
  if (
    isFilled(rate["expected-count-of-success"]) &&
    isFilled(rate["fac-count"])
  )
    rate["epr-min-stay"] = roundTo(
      rate["expected-count-of-success"] / rate["fac-count"],
      2
    );

  //Risk Adjusted Rate for the Minimizing Length of Facility Stay
  if (
    isFilled(rate["opr-min-stay"]) &&
    isFilled(rate["epr-min-stay"]) &&
    isFilled(rate["multi-plan"])
  )
    rate["rar-min-stay"] = roundTo(
      (rate["opr-min-stay"] / rate["epr-min-stay"]) * rate["multi-plan"],
      2
    );

  return rate;
};

export const NDRCalc = (rate: AnyObject, multiplier: number) => {
  const { numerator, denominator } = rate;

  if (!isFilled(numerator) || !isFilled(denominator)) return "";

  return roundTo(numerator / denominator, 2) * multiplier;
};
