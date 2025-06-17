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

  /*
   * We add epsilon (which is about 2e-16) so that 5s will be rounded up.
   * That is the default behavior of Math.round already, but many numbers which
   * appear to be 5s are actually stored as slightly smaller.
   * For example, the actual value of 0.145 is about 0.144999999999999990,
   * where (0.145 + number.EPSILON) results in about 0.145000000000000017.
   * The former rounds down, and the latter rounds up.
   *
   * On the other hand, adding epsilon will produce just as many errors:
   * values that should have rounded down that will now round up. Right?
   * In theory yes, but in practice no. It's very easy to type "0.145"
   * (or obtain that value through calculation), but it's a lot harder
   * (and less common to calculate) the value 0.1444999999999998,
   * which this method would erroneously round to 0.145. So adding epsilon
   * will give the right answer more often that it gives the wrong one.
   *
   * To be truly accurate to decimal math 100% of the time (in JS, in 2025),
   * we would need to implement our own numeric parsing & decimal math routines,
   * (or pull in a 3rd party library) which would definitely not be worthwhile.
   */
  const shift = Math.pow(10, DECIMAL_PLACES);
  const result = Math.round((value + Number.EPSILON) * shift) / shift;
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
  value = value.trim();
  if (value === "") return undefined;
  const nonNumericChars = /[^.-\d]/;
  if (value.match(nonNumericChars)) return undefined;
  if (isNaN(Number(value))) return undefined;
  const parsed = parseFloat(value);
  if (Object.is(parsed, -0)) return 0;
  return parsed;
};
