import { parseNumber } from "./calculations";

describe("Rate calculations", () => {
  describe("parseNumber", () => {
    it.each([
      { input: "42", expected: 42 },
      { input: "12.", expected: 12 },
      { input: ".012", expected: 0.012 },
      { input: "12.5", expected: 12.5 },
      { input: "-77", expected: -77 },
      { input: "-.3", expected: -0.3 },
      { input: "0", expected: 0 },
      { input: "-0", expected: 0 }, // even though 0 and -0 are different things
      { input: "", expected: undefined },
      { input: "    ", expected: undefined },
      { input: "1abc", expected: undefined }, // even though parseFloat("1abc") === 1
      { input: "Infinity", expected: undefined }, // even though isNaN(Infinity) === false
      { input: "1.5e2", expected: undefined }, // even though 1.5e2 === 150
      { input: "0xaf", expected: undefined }, // even though 0xaf === 175
      { input: "1_000", expected: undefined }, // even though 1_000 === 1000
    ])("should return $expected given '$input'", ({ input, expected }) => {
      expect(parseNumber(input)).toBe(expected);
    });
  });
});
