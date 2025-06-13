import { zip } from "./arrays";

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
