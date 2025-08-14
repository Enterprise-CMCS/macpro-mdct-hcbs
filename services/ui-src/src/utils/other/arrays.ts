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

/**
 * Partition the array according to the selector.
 * Adjacent elements for which the selector gives the same value
 * will be placed into the same chunk.
 * @example
 * chunkBy([..."bookkeeper"], isVowel)
 * // => [["b"],["o","o"],["k","k"],["e","e"],["p"],["e"],["r"]]
 */
export const chunkBy = <T, U>(array: T[], selector: (element: T) => U) => {
  if (array.length === 0) {
    return [];
  }
  const chunks: T[][] = [];
  let currentChunk = [array[0]];
  let lastKey = selector(array[0]);

  for (let element of array.slice(1)) {
    const key = selector(element);
    if (key === lastKey) {
      currentChunk.push(element);
    } else {
      chunks.push(currentChunk);
      currentChunk = [element];
      lastKey = key;
    }
  }

  chunks.push(currentChunk);
  return chunks;
};
