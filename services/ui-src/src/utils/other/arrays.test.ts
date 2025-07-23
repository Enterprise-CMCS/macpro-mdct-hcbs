import { chunkBy, zip } from "./arrays";

describe("zip", () => {
  it("should create pairs of elements from the input arrays", () => {
    const numbers = [1, 2, 3];
    const words = ["one", "two", "three"];
    const pairs = zip(numbers, words);
    expect(pairs).toEqual([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);
  });

  it("should throw an exception if the input arrays have different lengths", () => {
    expect(() => zip([1, 2, 3], ["a", "b"])).toThrow();
    expect(() => zip([1, 2], ["a", "b", "c"])).toThrow();
  });

  it("should throw an exception if either input array is undefined", () => {
    const missingArray: number[] | undefined = undefined;
    expect(() => zip([], missingArray!)).toThrow();
    expect(() => zip(missingArray!, [])).toThrow();
  });
});

describe("chunkBy", () => {
  it("should return an empty array given an empty array", () => {
    expect(chunkBy([], () => {})).toEqual([]);
  });

  it("should group sequential elements by the selector", () => {
    const numbers = [1, 1, 3, 2, 6, 3, 5, 2, 1];
    const isEven = (n: number) => n % 2 === 0;
    const result = chunkBy(numbers, isEven);
    expect(result).toEqual([[1, 1, 3], [2, 6], [3, 5], [2], [1]]);
  });
});
