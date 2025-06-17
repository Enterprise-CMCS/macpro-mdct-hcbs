/**
 * Create an array of pairs of elements from the two input arrays.
 * @throws if the input arrays are different lengths,
 *    or if either array is undefined.
 * @example
 * const a = [1, 2, 3];
 * const b = ["one", "two", "three"];
 * zip(a, b) // => [[1, "one"], [2, "two"], [3, "three"]]
 */
export const zip = <T, U>(arrayA: T[], arrayB: U[]): [T, U][] => {
  if (arrayA.length !== arrayB.length) {
    throw new Error(
      `Cannot zip arrays of different lengths! Got lengths ${arrayA.length}, ${arrayB.length}`
    );
  }
  return arrayA.map((a, i) => [a, arrayB[i]]);
};
