import { FacilityLengthOfStayAnswer } from "types";
import { AnyObject } from "yup";

const isFilled = (item: string | number | undefined) => {
  return item !== "" && item !== undefined;
};

export const FacilityLengthOfStayCalc = (rate: FacilityLengthOfStayAnswer) => {
  rate.actualRate = "";
  rate.expectedRate = "";
  rate.riskAdjustedRate = "";

  // Observed Performance Rate for the Minimizing Length of Facility Stay
  if (isFilled(rate.actualDischarges) && isFilled(rate.admissionCount))
    rate.actualRate =
      Number(rate.actualDischarges) / Number(rate.admissionCount);

  // Expected Performance Rate for the Minimizing Length of Facility Stay
  if (isFilled(rate.expectedDischarges) && isFilled(rate.admissionCount))
    rate.expectedRate =
      Number(rate.expectedDischarges) / Number(rate.admissionCount);

  // Risk Adjusted Rate for the Minimizing Length of Facility Stay
  if (
    isFilled(rate.actualRate) &&
    isFilled(rate.expectedRate) &&
    isFilled(rate.populationRate)
  )
    rate.riskAdjustedRate =
      (Number(rate.actualRate) / Number(rate.expectedRate)) *
      Number(rate.populationRate);

  return rate;
};

export const NDRCalc = (rate: AnyObject, multiplier: number) => {
  const { numerator, denominator } = rate;

  if (!isFilled(numerator) || !isFilled(denominator)) return "";

  return (Math.round((numerator / denominator) * 1000) / 10) * multiplier;
};
