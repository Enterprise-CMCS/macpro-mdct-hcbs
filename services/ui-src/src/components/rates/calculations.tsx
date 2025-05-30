import { LengthOfStayRateTemplate } from "types";
import { AnyObject } from "yup";

const isFilled = (item: string) => {
  return item !== "" && item !== undefined;
};

export const roundTo = (value: number, decimal: number) => {
  const shift = Math.pow(10, decimal);
  return Math.round(value * shift) / shift;
};

/**
 * Converts a string to a floating-point number.
 *
 * Designed to accept user-entered values, but reject typos.
 * For examples of how this function behaves, see the unit tests.
 *
 * Type coercions, partial successes, and edge cases make JS parsing hard.
 * For more see https://stackoverflow.com/questions/175739
 */
export const parseNumber = (value: string) => {
  if (value.trim().length === 0) return undefined;
  if (isNaN(Number(value))) return undefined;
  const nonNumericChars = /[^.-\d]/;
  if (value.match(nonNumericChars)) return undefined;
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return undefined;
  if (Object.is(parsed, -0)) return 0;
  return parsed;
};

export const isNumber = (value: string) => {
  return parseNumber(value) !== undefined;
};

export const FacilityLengthOfStayCalc = (
  rate: NonNullable<LengthOfStayRateTemplate["answer"]>
) => {
  const maybeRound = (x: number | undefined) => {
    if (x === undefined) return undefined;
    return roundTo(x, 2);
  };

  const {
    performanceTarget,
    actualCount,
    denominator,
    expectedCount,
    populationRate,
  } = rate;

  let actualRate: number | undefined = undefined;
  let expectedRate: number | undefined = undefined;
  let adjustedRate: number | undefined = undefined;

  // If we don't have a denominator then none of these calculations will work
  const canCalc = denominator !== undefined && denominator !== 0;

  if (canCalc && actualCount !== undefined)
    actualRate = actualCount / denominator;

  if (canCalc && expectedCount !== undefined)
    expectedRate = expectedCount / denominator;

  if (
    actualRate !== undefined &&
    expectedRate !== undefined &&
    populationRate !== undefined
  )
    adjustedRate = (populationRate * actualRate) / expectedRate;

  return {
    performanceTarget,
    actualCount,
    denominator,
    expectedCount,
    populationRate,
    actualRate: maybeRound(actualRate),
    expectedRate: maybeRound(expectedRate),
    adjustedRate: maybeRound(adjustedRate),
  };
};

export const NDRCalc = (rate: AnyObject, multiplier: number) => {
  const { numerator, denominator } = rate;

  if (!isFilled(numerator) || !isFilled(denominator)) return undefined;

  return roundTo(numerator / denominator, 1) * multiplier;
};
