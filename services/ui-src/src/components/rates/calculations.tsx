/**
 * Every calculation in the QMS report rounds its result to two decimal places.
 */
const DECIMAL_PLACES = 2;

/**
 * Round the given number to {@link DECIMAL_PLACES}.
 * If it is undefined, return undefined.
 */
export const roundRate = (value: number | undefined): number | undefined => {
  if (value === undefined) return undefined;

  const shift = Math.pow(10, DECIMAL_PLACES);
  const result = Math.round(value * shift) / shift;
  if (Object.is(result, -0)) return 0;
  return result;
};

/**
 * Convert the given number to a string.
 * If it is undefined, return an empty string.
 */
export const stringifyInput = (value: number | undefined) => {
  if (value === undefined) return "";
  return value.toString();
};

/**
 * Convert the given number to a string.
 * If it is undefined, return an empty string.
 * If it is zero, include {@link DECIMAL_PLACES} trailing zeroes.
 *
 * Note: We include trailing zeroes for calculated zeroes to assure the user
 * that a calculation took place. For example, if the calculation is `1 / 1000`,
 * and we only display `0`, it may seem that the calculation errored out.
 * Whereas displaying `0.00` gives a nicer impression.
 */
export const stringifyResult = (value: number | undefined) => {
  if (value === undefined) return "";
  if (value === 0) return (0).toFixed(DECIMAL_PLACES);
  return value.toString();
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
