import { FacilityLengthOfStayAnswer } from "types";
import { AnyObject } from "yup";

const isFilled = (item: string | number | undefined) => {
  return item !== "" && item !== undefined;
};

export const isNumber = (value: string) => {
  const allNumbers = /^-?\d*\.?\d*$/i;
  return allNumbers.test(value);
};

/**
 * Create a type which has all the keys of the input type,
 * which may have any of the values of the input type,
 * but which also allows values to be strings.
 * @example
 * type Foo = { bar: number };
 * type Quux = Unparsed<Foo>; // { bar: string | number }
 */
type Unparsed<TObj extends Record<string, unknown>> = Record<
  keyof TObj,
  string | TObj[keyof TObj]
>;

const parseValue = (value: string | number | undefined) => {
  if (value === undefined || value === "") {
    return undefined;
  }
  let parsed: number;
  if ("number" === typeof value) {
    parsed = value;
  } else {
    parsed = Number(value.replaceAll(/[^\d.-]/g, ""));
  }
  if (isNaN(parsed) || !isFinite(parsed)) {
    return undefined;
  }
  return parsed;
};

const parseAnswer = (obj: Partial<Unparsed<FacilityLengthOfStayAnswer>>) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, parseValue(value)])
  ) as Partial<FacilityLengthOfStayAnswer>;
};

const round = (value: number | undefined) => {
  if (value === undefined) {
    return value;
  }
  return Math.round(value * 100) / 100;
};

export const FacilityLengthOfStayCalc = (
  rate: Partial<Unparsed<FacilityLengthOfStayAnswer>>
): FacilityLengthOfStayAnswer => {
  let {
    performanceTarget,
    actualTransitions,
    stayCount,
    expectedTransitions,
    populationRate,
    expectedRate,
    actualRate,
    riskAdjustedRate,
  } = parseAnswer(rate);

  // Observed Performance Rate for the Minimizing Length of Facility Stay
  if (actualTransitions !== undefined && stayCount !== undefined) {
    actualRate = actualTransitions / stayCount;
  } else {
    actualRate = undefined;
  }

  // Expected Performance Rate for the Minimizing Length of Facility Stay
  if (expectedTransitions !== undefined && stayCount !== undefined) {
    expectedRate = expectedTransitions / stayCount;
  } else {
    expectedRate = undefined;
  }

  // Risk Adjusted Rate for the Minimizing Length of Facility Stay
  if (
    actualRate !== undefined &&
    expectedRate !== undefined &&
    populationRate !== undefined
  ) {
    riskAdjustedRate = (actualRate / expectedRate) * populationRate;
  } else {
    riskAdjustedRate = undefined;
  }

  return {
    performanceTarget: round(performanceTarget),
    actualTransitions: round(actualTransitions),
    stayCount: round(stayCount),
    expectedTransitions: round(expectedTransitions),
    populationRate: round(populationRate),
    expectedRate: round(expectedRate),
    actualRate: round(actualRate),
    riskAdjustedRate: round(riskAdjustedRate),
  };
};

export const NDRCalc = (rate: AnyObject, multiplier: number) => {
  const { numerator, denominator } = rate;

  if (!isFilled(numerator) || !isFilled(denominator)) return "";

  return (Math.round((numerator / denominator) * 1000) / 10) * multiplier;
};
